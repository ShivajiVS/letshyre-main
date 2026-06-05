import React from 'react';

const DashboardStatsSkeleton = () => {
  return (
    <>
      <style>{`
        .skeleton-pulse {
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: skeleton-loading 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes skeleton-loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="ds-sub-inner01">
          <div style={{ padding: '20px 20px 0' }}>
            <div className="skeleton-pulse" style={{ width: '50%', height: '20px' }}></div>
          </div>
          
          <div className="ds-card-body">
            <div className="ds-card-left">
              <div className="skeleton-pulse" style={{ width: '45px', height: '45px', borderRadius: '8px' }}></div>
            </div>

            <div className="ds-card-center" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '15px' }}>
              <div className="skeleton-pulse" style={{ width: '40px', height: '30px' }}></div>
              <div className="skeleton-pulse" style={{ width: '120px', height: '15px' }}></div>
            </div>

            <div className="ds-card-right">
              <div className="skeleton-pulse" style={{ width: '50px', height: '40px' }}></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default DashboardStatsSkeleton;
