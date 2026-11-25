const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const https = require('https');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

// -------------------------------------------------------------
// GOOGLE GEMINI CONFIGURATION
// -------------------------------------------------------------
const API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Leave blank for default XAMPP/WAMP
  database: 'stylehub_db'
});

db.connect((err) => {
  if (err) console.error('Database Connection Error:', err);
  else console.log('Connected to MySQL Database: stylehub_db');
});

const ADMIN_EMAIL = 'admin@shop.com';
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

// 1. REGISTER
app.post('/api/register', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ success: false, message: 'First name, last name, email, and password are required.' });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match.' });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters with 1 number and 1 symbol (!@#$%^&*).' 
    });
  }

  const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';
  const sql = 'INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [firstName, lastName, email.toLowerCase(), password, role], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
      }
      return res.status(500).json({ success: false, message: err.message });
    }
    
    res.status(201).json({ 
      success: true, 
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: email.toLowerCase(), 
      role, 
      message: 'Account created successfully!' 
    });
  });
});

// 2. LOGIN
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(sql, [email.toLowerCase(), password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length > 0) {
      const user = results[0];
      const isAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() || user.role === 'admin';
      const fullName = user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.email.split('@')[0];

      res.json({ 
        success: true, 
        name: fullName,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone || '',
        email: user.email, 
        role: isAdmin ? 'admin' : 'customer'
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
  });
});

// 3. FETCH ALL PRODUCTS
app.get('/api/products', (req, res) => {
  const sql = 'SELECT * FROM products ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ success: false, message: err.message });
    }
    res.json(results || []);
  });
});

// 4. ADD PRODUCT
app.post('/api/products', (req, res) => {
  const { 
    category, name, price, original_mrp, stock_quantity, 
    available_colors, fabric, work_type, wash_care, image_url, description 
  } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({ success: false, message: 'Product Name, Price, and Image are required.' });
  }

  const safeCategory = (category && category.trim()) || 'Saree';
  const safeColors = (available_colors && available_colors.trim()) || 'Peach, Lavender, Red, Black';
  const safePrice = parseFloat(price) || 0;
  const safeMrp = original_mrp ? parseFloat(original_mrp) : (safePrice * 1.25).toFixed(0);
  const safeStock = stock_quantity !== undefined && stock_quantity !== '' ? parseInt(stock_quantity, 10) : 10;
  const safeFabric = (fabric && fabric.trim()) || 'Pure Georgette';
  const safeWork = (work_type && work_type.trim()) || 'Embroidered';
  const safeWash = (wash_care && wash_care.trim()) || 'Dry Clean Only';
  const safeDesc = (description && description.trim()) || 'Premium quality ethnic wear crafted with comfort and elegance.';

  db.query('SHOW COLUMNS FROM products', (colErr, columns) => {
    if (colErr) return res.status(500).json({ success: false, message: colErr.message });

    const columnNames = columns.map(c => c.Field);
    const hasAdvancedCols = columnNames.includes('original_mrp') && columnNames.includes('stock_quantity');

    if (hasAdvancedCols) {
      const sql = `INSERT INTO products 
        (category, available_colors, name, price, original_mrp, stock_quantity, fabric, work_type, wash_care, image_url, description) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.query(sql, [
        safeCategory, safeColors, name.trim(), safePrice, safeMrp,
        safeStock, safeFabric, safeWork, safeWash, image_url, safeDesc
      ], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, id: result.insertId, message: 'Product saved successfully!' });
      });
    } else {
      const sql = 'INSERT INTO products (category, name, price, image_url, description) VALUES (?, ?, ?, ?, ?)';
      db.query(sql, [safeCategory, name.trim(), safePrice, image_url, safeDesc], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.status(201).json({ success: true, id: result.insertId, message: 'Product saved successfully!' });
      });
    }
  });
});

// 5. UPDATE PRODUCT
app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const { 
    category, name, price, original_mrp, stock_quantity, 
    available_colors, fabric, work_type, wash_care, image_url, description 
  } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({ success: false, message: 'Product Name, Price, and Image are required.' });
  }

  const safeCategory = (category && category.trim()) || 'Saree';
  const safeColors = (available_colors && available_colors.trim()) || 'Peach, Lavender, Red, Black';
  const safePrice = parseFloat(price) || 0;
  const safeMrp = original_mrp ? parseFloat(original_mrp) : (safePrice * 1.25).toFixed(0);
  const safeStock = stock_quantity !== undefined && stock_quantity !== '' ? parseInt(stock_quantity, 10) : 10;
  const safeFabric = (fabric && fabric.trim()) || 'Pure Georgette';
  const safeWork = (work_type && work_type.trim()) || 'Embroidered';
  const safeWash = (wash_care && wash_care.trim()) || 'Dry Clean Only';
  const safeDesc = (description && description.trim()) || 'Premium quality ethnic wear crafted with comfort and elegance.';

  db.query('SHOW COLUMNS FROM products', (colErr, columns) => {
    if (colErr) return res.status(500).json({ success: false, message: colErr.message });

    const columnNames = columns.map(c => c.Field);
    const hasAdvancedCols = columnNames.includes('original_mrp') && columnNames.includes('stock_quantity');

    if (hasAdvancedCols) {
      const sql = `UPDATE products SET 
        category = ?, available_colors = ?, name = ?, price = ?, original_mrp = ?, 
        stock_quantity = ?, fabric = ?, work_type = ?, wash_care = ?, image_url = ?, description = ? 
        WHERE id = ?`;

      db.query(sql, [
        safeCategory, safeColors, name.trim(), safePrice, safeMrp, 
        safeStock, safeFabric, safeWork, safeWash, image_url, safeDesc, productId
      ], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Product updated successfully!' });
      });
    } else {
      const sql = 'UPDATE products SET category = ?, name = ?, price = ?, image_url = ?, description = ? WHERE id = ?';
      db.query(sql, [safeCategory, name.trim(), safePrice, image_url, safeDesc, productId], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Product updated successfully!' });
      });
    }
  });
});

// 6. DELETE PRODUCT
app.delete('/api/products/:id', (req, res) => {
  const sql = 'DELETE FROM products WHERE id = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json({ success: true, message: 'Product deleted.' });
  });
});

// 7. FETCH ALL USERS
app.get('/api/users', (req, res) => {
  const sql = 'SELECT id, first_name, last_name, email, role, created_at FROM users ORDER BY id DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    res.json(results || []);
  });
});

// 8. SECURE PROFILE UPDATE
app.put('/api/update-profile', (req, res) => {
  const { currentEmail, currentPassword, newFirstName, newLastName, newPhone, newEmail, newPassword } = req.body;

  if (!currentEmail) {
    return res.status(400).json({ success: false, message: 'Current email is required.' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [currentEmail.toLowerCase()], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Account not found.' });

    const user = results[0];

    if ((newEmail && newEmail.toLowerCase() !== currentEmail.toLowerCase()) || newPassword) {
      if (!currentPassword || currentPassword !== user.password) {
        return res.status(401).json({ success: false, message: 'Incorrect current password.' });
      }
    }

    if (newPassword && !passwordRegex.test(newPassword)) {
      return res.status(400).json({ 
        success: false, 
        message: 'New password must be 8+ chars with at least 1 number and 1 symbol (!@#$%^&*).' 
      });
    }

    const updatedFirstName = newFirstName !== undefined ? newFirstName : user.first_name;
    const updatedLastName = newLastName !== undefined ? newLastName : user.last_name;
    const updatedPhone = newPhone !== undefined ? newPhone : (user.phone || '');
    const updatedEmail = newEmail ? newEmail.toLowerCase() : user.email;
    const updatedPassword = newPassword ? newPassword : user.password;

    db.query('SHOW COLUMNS FROM users LIKE "phone"', (phoneErr, phoneCols) => {
      let updateSql = 'UPDATE users SET first_name = ?, last_name = ?, email = ?, password = ? WHERE id = ?';
      let updateParams = [updatedFirstName, updatedLastName, updatedEmail, updatedPassword, user.id];

      if (!phoneErr && phoneCols.length > 0) {
        updateSql = 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, email = ?, password = ? WHERE id = ?';
        updateParams = [updatedFirstName, updatedLastName, updatedPhone, updatedEmail, updatedPassword, user.id];
      }

      db.query(updateSql, updateParams, (updateErr) => {
        if (updateErr) {
          if (updateErr.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'This email is already in use by another account.' });
          }
          return res.status(500).json({ success: false, message: updateErr.message });
        }

        res.json({ 
          success: true, 
          name: `${updatedFirstName} ${updatedLastName}`.trim(),
          firstName: updatedFirstName,
          lastName: updatedLastName,
          phone: updatedPhone,
          email: updatedEmail,
          message: 'Account updated successfully!' 
        });
      });
    });
  });
});

// 9. SEND OTP SMS VIA FAST2SMS
app.post('/api/send-otp', (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required.' });
  }

  const cleanPhone = phone.toString().replace(/\D/g, '').slice(-10);

  const postData = JSON.stringify({
    route: 'otp',
    variables_values: otp.toString(),
    numbers: cleanPhone
  });

  const options = {
    hostname: 'www.fast2sms.com',
    port: 443,
    path: '/dev/bulkV2',
    method: 'POST',
    headers: {
      'authorization': 'YOUR_FAST2SMS_API_KEY',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', (chunk) => (data += chunk));
    response.on('end', () => {
      try {
        const parsedData = JSON.parse(data);
        res.json({ success: true, message: 'SMS sent successfully', data: parsedData });
      } catch (err) {
        res.json({ success: true, message: 'SMS request dispatched', raw: data });
      }
    });
  });

  request.on('error', (error) => {
    console.error('Fast2SMS Gateway Error:', error);
    res.status(500).json({ success: false, error: error.message });
  });

  request.write(postData);
  request.end();
});

// 10. REAL-TIME AI ASSISTANT ENDPOINT
app.post('/api/ai-chat', async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
  }

  db.query('SELECT name, category, price, available_colors, fabric, work_type FROM products LIMIT 30', async (err, products) => {
    const liveCatalog = (products || []).map(p => 
      `- ${p.name} [Category: ${p.category}] | Price: ₹${p.price} | Colors: ${p.available_colors || 'Standard'} | Fabric: ${p.fabric || 'Pure Textile'}`
    ).join('\n');

    const systemInstruction = `You are "Aria", an expert AI Personal Stylist and Support Specialist for StyleHub (India's premier ethnic boutique).

Store Catalog:
${liveCatalog}

Store Policies:
- Free delivery on prepaid orders; standard arrival within 3–5 business days.
- Cash on Delivery (COD) supported with doorstep SMS OTP verification.
- 7-day return and exchange policy on all unworn items with tags.
- Customer Helpline: +91 9284899881 (Mon–Sat, 9:00 AM – 6:00 PM IST).

Instructions:
1. Answer any user fashion question, styling inquiry, size advice, or store policy question freely.
2. Recommend specific matching items from the catalog whenever relevant.
3. Keep responses warm, helpful, and concise with bullet points.`;

    try {
      // Primary model call
      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${systemInstruction}\n\nCustomer Question: ${message}`
        });
      } catch (primaryErr) {
        // Fallback model call
        response = await ai.models.generateContent({
          model: 'gemini-1.5-flash',
          contents: `${systemInstruction}\n\nCustomer Question: ${message}`
        });
      }

      res.json({
        success: true,
        reply: response.text
      });
    } catch (error) {
      console.error('Gemini API Error:', error);
      res.status(500).json({
        success: false,
        message: 'AI service error. Please verify your Gemini API key.'
      });
    }
  });
});
app.listen(5000, () => console.log('Server running on http://localhost:5000'));