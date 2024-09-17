import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../assets/FoodManagement.css";

const api = 'http://127.0.0.1:8000/';

// Hàm lấy thông tin danh mục
const getCategoryNameById = (categoryId, categories) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'N/A';
};

const FoodManagement = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newFood, setNewFood] = useState({ name: '', description: '', price: '', image: null, category: '' });
  const [editingFoodId, setEditingFoodId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchFoods();
    fetchCategories();
  }, []);

  // Fetch foods from API
  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${api}/food/`);
      setFoods(response.data);
    } catch (error) {
      console.error('Error fetching foods:', error);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${api}/category/`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFood((prevFood) => ({
      ...prevFood,
      [name]: value,
    }));
  };

  // Handle image input change
  const handleImageChange = (e) => {
    setNewFood((prevFood) => ({
      ...prevFood,
      image: e.target.files[0],
    }));
  };

  // Handle form submission (create or update food)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newFood.name);
    formData.append('description', newFood.description);
    formData.append('price', newFood.price);
    formData.append('category', newFood.category);

    if (newFood.image) {
      formData.append('image', newFood.image);
    }

    try {
      if (editingFoodId) {
        await axios.put(`${api}/food/${editingFoodId}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setEditingFoodId(null);
      } else {
        await axios.post(`${api}/food/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setNewFood({ name: '', description: '', price: '', image: null, category: '' });
      fetchFoods();
    } catch (error) {
      console.error('Error adding/updating food:', error);
    }
  };

  // Handle food deletion
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${api}/food/${id}/`);
      fetchFoods();
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  // Handle food edit
  const handleEdit = (food) => {
    setNewFood({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category ? food.category : '', // Update category ID
      image: null,
    });
    setEditingFoodId(food.id);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    setEditingFoodId(null);
    setNewFood({ name: '', description: '', price: '', image: null, category: '' });
  };

  // Handle category selection for filtering
  const handleCategoryFilter = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Filter foods based on selected category
  const filteredFoods = selectedCategory
    ? foods.filter((food) => food.category && food.category === parseInt(selectedCategory))
    : foods;

  return (
    <div className="food-manage">
      {/* Cột 1: Tạo món ăn */}
      <div className="column">
        <div className="create-food-form">
          <h2>Create Food</h2>
          <form className="food-form" onSubmit={handleSubmit}>
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
            <select
              name="category"
              value={newFood.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
            />
            <button type="submit">Add Food</button>
          </form>
        </div>

        {editingFoodId && (
          <div className="edit-food-form">
            <h2>Edit Food</h2>
            <form className="food-form" onSubmit={handleSubmit}>
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
              <select
                name="category"
                value={newFood.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
              />
              <button type="submit">Update Food</button>
              <button type="button" className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
            </form>
          </div>
        )}
      </div>

      {/* Cột 2: Danh sách món ăn */}
      <div className="column">
        <h2>Food List</h2>

        {/* Dropdown để lọc theo danh mục */}
        <select onChange={handleCategoryFilter}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <div className="food-list">
          {filteredFoods.map((food) => {
            const categoryInfo = getCategoryNameById(food.category, categories);
            return (
              <div key={food.id} className="food-item">
                {food.image && (
                  <img
                    src={`https://res.cloudinary.com/di0aqgf2u/${food.image}`}
                    alt={food.name}
                  />
                )}
                <div className="food-info">
                  <h3>{food.name}</h3>
                  <p>Description: {food.description}</p>
                  <p>Price: {food.price} VND</p>
                  <p>Category: {categoryInfo}</p>
                  <div className="food-item-actions">
                    <button onClick={() => handleEdit(food)}>Edit</button>
                    <button onClick={() => handleDelete(food.id)}>Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FoodManagement;
