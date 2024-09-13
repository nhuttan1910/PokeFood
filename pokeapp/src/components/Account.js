import React, { useState, useEffect } from "react";
import "../assets/account.css";

function Account() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [filter, setFilter] = useState("waiting");

  const cloudinaryBaseURL = "https://res.cloudinary.com/di0aqgf2u/";

  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user"));
        if (userInfo) {
          setUser(userInfo);
        } else {
          setError("Không tìm thấy thông tin người dùng.");
        }
      } catch (e) {
        setError("Lỗi khi phân tích thông tin người dùng.");
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      let url;
      switch (filter) {
        case "waiting":
          url = "http://127.0.0.1:8000/order/status-waiting/";
          break;
        case "shipping":
          url = "http://127.0.0.1:8000/order/status-shipping/";
          break;
        case "unpaid":
          url = "http://127.0.0.1:8000/order/status-unpaid/";
          break;
        case "completed":
          url = "http://127.0.0.1:8000/order/status-completed/";
          break;
        default:
          return;
      }

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lỗi khi lấy đơn hàng.");
        }
        const data = await response.json();
        setOrders(data);
      } catch (e) {
        setApiError(e.message);
      }
    };

    fetchOrders();
  }, [user, filter]);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>Có lỗi xảy ra: {error}</p>;
  }

  if (!user) {
    return <p>Không có thông tin người dùng.</p>;
  }

  return (
    <div className="account-container">
      <div className="account-details">
        <h2>Thông tin người dùng</h2>
        <div className="profile-image">
          <img src={`${cloudinaryBaseURL}${user.avatar}`} alt="Profile" />
        </div>
        <div className="profile-info">
          <h3>
            <strong></strong> {user.username}
          </h3>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>

      <div className="order-info">
        <h2>Đơn hàng của bạn</h2>
        <div className="order-filters">
          <button onClick={() => setFilter("waiting")}>Chưa xác nhận</button>
          <button onClick={() => setFilter("shipping")}>Đang giao</button>
          <button onClick={() => setFilter("unpaid")}>Chưa thanh toán</button>
          <button onClick={() => setFilter("completed")}>Hoàn thành</button>
        </div>

        {apiError && <p>Có lỗi xảy ra khi lấy đơn hàng: {apiError}</p>}
        {orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div className="order-item" key={order.id}>
                <h3>Đơn hàng #{order.id}</h3>
                <p>Ngày đặt hàng: {new Date(order.pay_date).toLocaleDateString()}</p>
                <div className="order-items">
                  {(order.order_details || []).map((detail) => {
                    const totalPrice = detail.food.price * detail.quantity;
                    return (
                      <div className="order-detail-item" key={detail.id}>
                        <img
                          src={`${cloudinaryBaseURL}${detail.food.image}`}
                          alt={detail.food.name}
                          className="order-item-image"
                        />
                        <div className="order-item-details">
                          <h4>{detail.food.name}</h4>
                          <p>Giá: {detail.food.price.toLocaleString()} VND</p>
                          <p>Số lượng: {detail.quantity}</p>
                          <p>Tổng cộng: {totalPrice.toLocaleString()} VND</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
