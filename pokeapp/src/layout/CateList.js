import React, { useEffect, useState } from 'react';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';

const CateList = ({ onCategorySelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/category/");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const cloudinaryBaseURL = 'https://res.cloudinary.com/di0aqgf2u/';
        setCategories(data.map(category => ({
          ...category,
          image: cloudinaryBaseURL + category.image
        })));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container-body">
      <h2 className="container-body-title">Menu</h2>
      <ul className="container-body-list">
        {categories.map(category => (
          <li
            key={category.id}
            className="container-body-item"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); onCategorySelect(category.id); }}>
              <span className={`container-body-item-img ${selectedCategory === category.id ? 'container-body-item-img-selected' : ''}`}>
                <img src={category.image || './assets/img/default.jpg'} alt={category.name} />
              </span>
              <p className={`container-body-item-text ${selectedCategory === category.id ? 'container-body-item-text-selected' : ''}`}>
                {category.name}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CateList;
