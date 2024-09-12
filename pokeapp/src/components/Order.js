import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';
import '../assets/order.css';
import '../assets/cart.css';

function Order() {
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingAddress, setShippingAddress] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [notification, setNotification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("orderItems"));
    const savedTotal = localStorage.getItem("orderTotal");

    if (savedItems && savedTotal) {
      setOrderItems(savedItems);
      setTotalAmount(parseInt(savedTotal));
    }
  }, []);

  const handleOrder = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post("http://127.0.0.1:8000/order/create-order/", {
        address: shippingAddress,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.status === 201) {
        setNotification(true);
        localStorage.removeItem("orderItems");
        localStorage.removeItem("orderTotal");
        setOrderItems([]);
        setTotalAmount(0);
        setShippingAddress("");
      } else {
        setOrderStatus("Có lỗi xảy ra khi tạo đơn hàng!");
      }
    } catch (error) {
      console.error("Failed to create order:", error.response ? error.response.data : error.message);
      setOrderStatus("Có lỗi xảy ra khi tạo đơn hàng!");
    }
  };

  const handlePayment = () => {
    console.log("Thanh toán ngay!");
  };

  const handleNotification = () => {
    setNotification(false);
    navigate('/');
  };

  return (
    <div className="cart-container">
      <h1>Thông tin đặt hàng</h1>
      <div className="cart-items">
        {orderItems.map((item) => {
          const totalPrice = item.food.price * item.quantity;
          return (
            <div className="cart-item" key={item.id}>
              <div className="item-info">
                <img src={`https://res.cloudinary.com/di0aqgf2u/${item.food.image}`} alt={item.food.name} className="item-image" />
                <div className="item-details">
                    <h2>{item.food.name}</h2>
                    <p>Giá: {item.food.price.toLocaleString()} VND</p>
                    <p>Số lượng: {item.quantity}</p>
                </div>
              </div>
              <div className="item-total">
                  {(item.food.price * item.quantity).toLocaleString()} VND
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h3>Tổng cộng: {totalAmount.toLocaleString()} VND</h3>
      </div>

      <div className="shipping-address">
        <h3>Địa chỉ giao hàng</h3>
        <input
          type="text"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Nhập địa chỉ giao hàng"
          className="address-input"
        />
      </div>

      <div className="order-actions">
        <button className="confirm-btn" onClick={handleOrder}>Xác nhận</button>
        <button className="pay-btn" onClick={handlePayment}>Thanh toán ngay</button>
        <button className="cancel-btn" onClick={() => window.history.back()}>Hủy</button>
      </div>

      {notification && (
        <div className="notification-container">
          <div className="notification-content">
            <p>Đã đặt hàng thành công</p>
            <p>Đơn hàng sẽ sớm được giao đến bạn!!!</p>
            <button className="close-notification-btn" onClick={handleNotification}>Đóng</button>
          </div>
        </div>
      )}

      {orderStatus && (
        <div className="order-status">
          <p>{orderStatus}</p>
        </div>
      )}
    </div>
  );
}

export default Order;
