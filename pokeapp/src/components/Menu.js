import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CateList from '../layout/CateList.js';
import FoodList from '../layout/FoodList.js';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    if (search) {
      setSearchTerm(search);
      setSelectedCategory(null);
    }
  }, [location]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchTerm('');
  };

  return (
    <div>
      <CateList
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <FoodList categoryId={selectedCategory} searchTerm={searchTerm} />
    </div>
  );
};

export default Menu;
