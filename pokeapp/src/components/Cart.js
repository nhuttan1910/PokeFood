import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';
import '../assets/cart.css';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://127.0.0.1:8000/cart/current-cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(response.data.cart_details);
        calculateTotal(response.data.cart_details);
      } catch (error) {
        console.error("Failed to fetch cart data:", error);
      }
    };

    fetchCart();
  }, []);

  const calculateTotal = (items) => {
    let total = 0;
    items.forEach((item) => {
      total += item.food.price * item.quantity;
    });
    setTotalAmount(total);
  };

  const handleQuantityChange = async (id, newQuantity) => {
    if (newQuantity <= 0) return;

    try {
      const token = localStorage.getItem("access_token");
      await axios.patch("http://127.0.0.1:8000/cart/update-item/", {
        id: id,
        quantity: newQuantity
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedItems = cartItems.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });

      setCartItems(updatedItems);
      calculateTotal(updatedItems);
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete("http://127.0.0.1:8000/cart/remove-item/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id: id }
      });

      setCartItems(cartItems.filter(item => item.id !== id));
      calculateTotal(cartItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleOrder = () => {
    localStorage.setItem("orderItems", JSON.stringify(cartItems));
    localStorage.setItem("orderTotal", totalAmount.toString());
    navigate("/order");
  };

  const imageBaseURL = "https://res.cloudinary.com/di0aqgf2u/";
  const emptyCartImage = "https://res.cloudinary.com/di0aqgf2u/image/upload/v1726134254/cart_exlrax.png";

  return (
    <div className="cart-container">
      <h1>Giỏ hàng của bạn</h1>
      <div className="cart-items">
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img src={emptyCartImage} alt="Empty Cart" className="empty-cart-image" />
            <p>Giỏ hàng trống!!!</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <div className="item-info">
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Xóa
                </button>
                <img src={`${imageBaseURL}${item.food.image}`} alt={item.food.name} className="item-image" />
                <div className="item-details">
                  <h2>{item.food.name}</h2>
                  <p>Giá: {item.food.price.toLocaleString()} VND</p>
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
              <div className="item-total">
                {(item.food.price * item.quantity).toLocaleString()} VND
              </div>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Tổng cộng: {totalAmount.toLocaleString()} VND</h3>
          <button className="order-btn" onClick={handleOrder}>Đặt hàng</button>
        </div>
      )}
    </div>
  );
}

export default Cart;
