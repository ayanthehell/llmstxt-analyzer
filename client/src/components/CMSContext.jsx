import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CMSContext = createContext(null);

export const useCMS = () => useContext(CMSContext);

export const CMSProvider = ({ children }) => {
  const [cmsData, setCmsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCMS = async () => {
    try {
      const res = await axios.get('/api/cms');
      setCmsData(res.data || {});
    } catch (err) {
      console.error('Failed to load CMS data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMS();
  }, []);

  return (
    <CMSContext.Provider value={{ cmsData, loading, refreshCMS: fetchCMS }}>
      {children}
    </CMSContext.Provider>
  );
};
