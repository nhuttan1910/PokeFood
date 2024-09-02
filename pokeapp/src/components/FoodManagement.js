import React, { useEffect, useState } from 'react';
import axios from 'axios';
const api = 'http://127.0.0.1:8000/'
const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '' });
  
  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${api}food/`);
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prevFood) => ({
      ...prevFood,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/food/`, newFood);
      setNewFood({ name: '', description: '', price: '' });
      fetchFoods();
    } catch (error) {
      console.error('Error adding food:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/food/${id}/`);
      fetchFoods();
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  return (
    <div className="food-manage">
      <h2>Food Management</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={newFood.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newFood.description}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newFood.price}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Add Food</button>
      </form>

      <div className="food-list">
        {foods.map((food) => (
          <div key={food.id} className="food-item">
            <h3>{food.name}</h3>
            <p>{food.description}</p>
            <p>Price: {food.price}</p>
            <button onClick={() => handleDelete(food.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodManagement;
