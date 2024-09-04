import React, { useState } from 'react';
import CateList from '../layout/CateList.js';
import FoodList from '../layout/FoodList.js';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  return (
    <div>
      <CateList
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      <FoodList categoryId={selectedCategory} />
    </div>
  );
};

export default Menu;
