import React, { useEffect, useRef } from 'react';

const AdUnit = ({ slotId, format = 'auto', className = '' }) => {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (window.adsbygoogle && adRef.current && !adRef.current.hasChildNodes()) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  const clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || 'ca-pub-XXXXXXXXXXXXXXXXX';

  return (
    <div className={`my-6 text-center w-full overflow-hidden flex flex-col items-center ${className}`}>
      <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-2 block">Advertisement</span>
      {/* AdSense Unit */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
        ref={adRef}
      ></ins>
    </div>
  );
};

export default AdUnit;
