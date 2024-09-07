import React, { useEffect, useState } from 'react';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';

const FoodList = ({ categoryId }) => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);

    if (!categoryId) {
      setFoods([]);
      setLoading(false);
      return;
    }

    const fetchFoods = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/food/category/?category=${categoryId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch foods");
        }
        const data = await response.json();
        const cloudinaryBaseURL = 'https://res.cloudinary.com/di0aqgf2u/';
        setFoods(
          data.map(food => ({
            ...food,
            image: cloudinaryBaseURL + food.image
          }))
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, [categoryId]);

  const handleAddToCart = (foodId) => {
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    // Thêm logic thêm vào giỏ hàng ở đây
    console.log("Thêm vào giỏ hàng: ", foodId);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="food-list">
      <div className="grid-2">
        <div className="grid-column-10">
          <div className="container-product">
            <div className="grid-row">
              {foods.map(food => (
                <div key={food.id} className="grid-column-2">
                  <div className="product-item">
                    <img src={food.image} alt={food.name} className="product-item-img" />
                    <h3 className="product-item-name">{food.name}</h3>
                    <div className="product-item-price">
                      <span className="product-item-price-now">{food.price.toLocaleString()} VNĐ</span>
                    </div>
                    <button className="product-item-btn" onClick={() => handleAddToCart(food.id)}>Thêm vào giỏ hàng</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodList;
