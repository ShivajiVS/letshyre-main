import React from 'react';

const CreditUsageCard = ({ credits, isLoading }) => {
  if (isLoading) {
    return (
      <div className="ds-sub-inner02">
        <div className="ds-credit-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <div className="skeleton-pulse" style={{ width: '60%', height: '24px', marginBottom: '30px' }}></div>
          <div className="skeleton-pulse" style={{ width: '160px', height: '160px', borderRadius: '50%' }}></div>
        </div>
      </div>
    );
  }

  const creditPercentage = credits?.usage_percent || 0;

  return (
    <div className="ds-sub-inner02">
      <div className="ds-credit-card">
        <h3>Team Credit Usage</h3>

        <div className="ds-circle-wrapper">
          <div className="ds-credits-text">
            <h1>{creditPercentage}%</h1>
            <p>
              of your credits <br />
              is used
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditUsageCard;
