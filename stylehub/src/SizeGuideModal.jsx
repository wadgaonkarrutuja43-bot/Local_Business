import React, { useState } from 'react';

const sizeData = {
  Lehenga: {
    hasTopAndBottom: true,
    top: [
      { label: 'Across Shoulder', s: 14, m: 14.5, l: 15, xl: 15.5, xxl: 16 },
      { label: 'Bust', s: 36, m: 38, l: 40, xl: 42, xxl: 44 },
      { label: 'Front Length', s: 14, m: 15, l: 15, xl: 16, xxl: 16 }
    ],
    bottom: [
      { label: 'Waist', s: 29, m: 30, l: 30, xl: 31, xxl: 31 },
      { label: 'Lehenga Length', s: 42, m: 42, l: 42, xl: 42, xxl: 42 }
    ]
  },
  Kurti: {
    hasTopAndBottom: false,
    top: [
      { label: 'Bust', s: 36, m: 38, l: 40, xl: 42, xxl: 44 },
      { label: 'Waist', s: 32, m: 34, l: 36, xl: 38, xxl: 40 },
      { label: 'Hip', s: 38, m: 40, l: 42, xl: 44, xxl: 46 },
      { label: 'Shoulder', s: 14, m: 14.5, l: 15, xl: 15.5, xxl: 16 },
      { label: 'Kurti Length', s: 44, m: 44, l: 45, xl: 45, xxl: 46 }
    ]
  },
  Saree: {
    hasTopAndBottom: false,
    notes: 'Sarees come in free size (Standard Length: 5.5 Meters). Blouse piece is unstitched (0.8 Meters) and can be tailored up to 44 Bust size.'
  },
  Tops: {
    hasTopAndBottom: false,
    top: [
      { label: 'Bust', s: 34, m: 36, l: 38, xl: 40, xxl: 42 },
      { label: 'Waist', s: 28, m: 30, l: 32, xl: 34, xxl: 36 },
      { label: 'Across Shoulder', s: 13.5, m: 14, l: 14.5, xl: 15, xxl: 15.5 },
      { label: 'Top Length', s: 23, m: 24, l: 24, xl: 25, xxl: 25 }
    ]
  },
  'Daily Wear': {
    hasTopAndBottom: true,
    top: [
      { label: 'Bust', s: 36, m: 38, l: 40, xl: 42, xxl: 44 },
      { label: 'Waist', s: 32, m: 34, l: 36, xl: 38, xxl: 40 },
      { label: 'Top Length', s: 36, m: 36, l: 37, xl: 37, xxl: 38 }
    ],
    bottom: [
      { label: 'Waist (Elastic)', s: 28, m: 30, l: 32, xl: 34, xxl: 36 },
      { label: 'Hip', s: 38, m: 40, l: 42, xl: 44, xxl: 46 },
      { label: 'Bottom Length', s: 38, m: 38, l: 39, xl: 39, xxl: 39 }
    ]
  },
  Jewellery: {
    hasTopAndBottom: false,
    notes: 'Standard Adjustable Size. Necklaces feature an adjustable drawstring (Dori) or extension chain suitable for all neck sizes.'
  }
};

export default function SizeGuideModal({ show, onClose, category = 'Kurti' }) {
  const [unit, setUnit] = useState('inch'); // 'inch' or 'cm'

  if (!show) return null;

  const currentCategoryKey = Object.keys(sizeData).find(
    (key) => key.toLowerCase() === category.toLowerCase()
  ) || 'Kurti';

  const chart = sizeData[currentCategoryKey] || sizeData.Kurti;

  const formatValue = (valInInch) => {
    if (unit === 'cm') {
      return (valInInch * 2.54).toFixed(1);
    }
    return valInInch;
  };

  return (
    <div className="size-modal-backdrop d-flex align-items-center justify-content-center p-3" tabIndex="-1">
      <div className="size-modal-card shadow-2xl">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-4 border-bottom bg-pink-light">
          <div>
            <h5 className="fw-bold m-0 text-maroon text-uppercase">Size Guide — {currentCategoryKey}</h5>
            <small className="text-muted">Standard body measurement and garment dimensions</small>
          </div>
          <button type="button" className="btn-close-pink" onClick={onClose}>✕</button>
        </div>

        <div className="p-4 size-modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          
          {/* Saree or Jewellery Notice */}
          {chart.notes ? (
            <div className="p-4 bg-pink-light border-pink rounded-3 text-center my-3">
              <i className="bi bi-info-circle fs-2 text-maroon mb-2 d-block"></i>
              <h6 className="fw-bold text-maroon">{currentCategoryKey} Sizing Information</h6>
              <p className="text-muted small m-0">{chart.notes}</p>
            </div>
          ) : (
            <>
              {/* Infographic Callout Diagram */}
              <div className="diagram-container p-4 rounded-4 mb-4 border-pink">
                <div className="row align-items-center g-4">
                  
                  {/* Left Callouts */}
                  <div className="col-4 d-flex flex-column gap-3">
                    <div className="guide-bubble">
                      <span className="bubble-tag">Bust</span>
                      <p className="bubble-text">Wrap the tape under your arms around the fullest part of your bustline.</p>
                    </div>
                    <div className="guide-bubble">
                      <span className="bubble-tag">Waist</span>
                      <p className="bubble-text">Run tape around your natural waistline just above the belly button.</p>
                    </div>
                    <div className="guide-bubble">
                      <span className="bubble-tag">Hip</span>
                      <p className="bubble-text">Take tape around fullest part of your hips with feet together.</p>
                    </div>
                    <div className="guide-bubble">
                      <span className="bubble-tag">Inseam</span>
                      <p className="bubble-text">Measure from highest inner thigh straight down to ankle.</p>
                    </div>
                  </div>

                  {/* Center Vector Silhouette */}
                  <div className="col-4 text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400" 
                      alt="Measurement Silhouette" 
                      className="img-fluid silhouette-img" 
                    />
                  </div>

                  {/* Right Callouts */}
                  <div className="col-4 d-flex flex-column gap-3">
                    <div className="guide-bubble">
                      <span className="bubble-tag">Shoulder</span>
                      <p className="bubble-text">Measure from edge of left shoulder across back neck to right shoulder edge.</p>
                    </div>
                    <div className="guide-bubble">
                      <span className="bubble-tag">Length</span>
                      <p className="bubble-text">Place tape tip at hollow of neck and pull down to desired hem length.</p>
                    </div>
                    <div className="guide-bubble">
                      <span className="bubble-tag">Outseam</span>
                      <p className="bubble-text">Place tape at waist/hip down to desired bottom trouser/skirt hem.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Unit Toggle Pill (Inch / CM) */}
              <div className="d-flex justify-content-center mb-4">
                <div className="measurement-toggle-pill d-flex align-items-center gap-3 px-4 py-2">
                  <span className="fw-bold text-maroon small">Body Measurement</span>
                  <div className="d-flex gap-3">
                    <label className="unit-radio-label">
                      <input 
                        type="radio" 
                        name="sizeUnit" 
                        value="inch" 
                        checked={unit === 'inch'} 
                        onChange={() => setUnit('inch')} 
                      />
                      <span>inch</span>
                    </label>
                    <label className="unit-radio-label">
                      <input 
                        type="radio" 
                        name="sizeUnit" 
                        value="cm" 
                        checked={unit === 'cm'} 
                        onChange={() => setUnit('cm')} 
                      />
                      <span>cm</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Measurement Tables */}
              <div className="row g-4 justify-content-center">
                
                {/* Top Garment Table */}
                {chart.top && (
                  <div className={chart.hasTopAndBottom ? 'col-md-6' : 'col-12'}>
                    <div className="size-table-card p-3 rounded-3">
                      <div className="text-center fw-bold text-maroon text-uppercase small mb-2">
                        {chart.hasTopAndBottom ? 'TOP / CHOLI' : `${currentCategoryKey} SIZES`}
                      </div>
                      <div className="table-responsive">
                        <table className="table table-sm text-center align-middle dashed-table mb-0">
                          <thead>
                            <tr>
                              <th className="text-start">Size</th>
                              <th>S</th>
                              <th>M</th>
                              <th>L</th>
                              <th>XL</th>
                              <th>XXL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chart.top.map((row, idx) => (
                              <tr key={idx}>
                                <td className="text-start fw-semibold">{row.label}</td>
                                <td>{formatValue(row.s)}</td>
                                <td>{formatValue(row.m)}</td>
                                <td>{formatValue(row.l)}</td>
                                <td>{formatValue(row.xl)}</td>
                                <td>{formatValue(row.xxl)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bottom Garment Table */}
                {chart.bottom && (
                  <div className="col-md-6">
                    <div className="size-table-card p-3 rounded-3">
                      <div className="text-center fw-bold text-maroon text-uppercase small mb-2">
                        BOTTOM / LEHENGA
                      </div>
                      <div className="table-responsive">
                        <table className="table table-sm text-center align-middle dashed-table mb-0">
                          <thead>
                            <tr>
                              <th className="text-start">Size</th>
                              <th>S</th>
                              <th>M</th>
                              <th>L</th>
                              <th>XL</th>
                              <th>XXL</th>
                            </tr>
                          </thead>
                          <tbody>
                            {chart.bottom.map((row, idx) => (
                              <tr key={idx}>
                                <td className="text-start fw-semibold">{row.label}</td>
                                <td>{formatValue(row.s)}</td>
                                <td>{formatValue(row.m)}</td>
                                <td>{formatValue(row.l)}</td>
                                <td>{formatValue(row.xl)}</td>
                                <td>{formatValue(row.xxl)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </>
          )}

          <div className="text-center mt-4">
            <small className="text-muted fst-italic">These measurements are indicative; actual size may vary slightly by fabric drape.</small>
          </div>

        </div>

      </div>

      <style>{`
        .size-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(102, 0, 24, 0.45);
          backdrop-filter: blur(6px);
          z-index: 2100;
        }

        .size-modal-card {
          background: #ffffff;
          width: 100%;
          max-width: 860px;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #ffd1dc;
        }

        .bg-pink-light {
          background: #fff0f3;
        }

        .border-pink {
          border: 1.5px solid #ffd1dc;
        }

        .btn-close-pink {
          background: transparent;
          border: none;
          color: #660018;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .diagram-container {
          background: #fff8f9;
        }

        .silhouette-img {
          max-height: 280px;
          object-fit: cover;
          border-radius: 12px;
          border: 2px dashed #ffccd5;
        }

        .guide-bubble {
          background: #ffffff;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid #ffe3e8;
          box-shadow: 0 2px 6px rgba(102, 0, 24, 0.04);
        }

        .bubble-tag {
          background: #ffd1dc;
          color: #660018;
          font-size: 11px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 50px;
          display: inline-block;
          margin-bottom: 3px;
        }

        .bubble-text {
          font-size: 10px;
          color: #555;
          margin: 0;
          line-height: 1.3;
        }

        .measurement-toggle-pill {
          background: #ffd1dc;
          border-radius: 50px;
        }

        .unit-radio-label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: #660018;
          cursor: pointer;
        }

        .size-table-card {
          background: #fff8f9;
          border: 1.5px dashed #ffccd5;
        }

        .dashed-table th, .dashed-table td {
          border: 1px dashed #ffccd5;
          padding: 6px 8px;
          font-size: 12px;
        }

        .dashed-table thead th {
          background: #ffe3e8;
          color: #660018;
        }
      `}</style>
    </div>
  );
}