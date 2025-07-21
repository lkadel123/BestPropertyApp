// DealContext.js
import React, { createContext, useState, useContext } from 'react';

const DealContext = createContext();

export const DealProvider = ({ children }) => {
  const [deals, setDeals] = useState([]); // Replace with API later
  const [selectedDeal, setSelectedDeal] = useState(null);

  const addDeal = (newDeal) => setDeals(prev => [...prev, newDeal]);
  const updateDeal = (id, updated) =>
    setDeals(prev => prev.map(d => (d.id === id ? { ...d, ...updated } : d)));
  const deleteDeal = (id) => setDeals(prev => prev.filter(d => d.id !== id));

  return (
    <DealContext.Provider value={{ deals, addDeal, updateDeal, deleteDeal, selectedDeal, setSelectedDeal }}>
      {children}
    </DealContext.Provider>
  );
};

export const useDeals = () => useContext(DealContext);
