import { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {}
  }, []);

  // Don't render on localhost — avoids 400 errors in development
  if (window.location.hostname === 'localhost') return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-4417285588153175"
      data-ad-slot="3749601951"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdBanner;