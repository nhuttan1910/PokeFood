import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/account.css";

const api = 'http://127.0.0.1:8000/';

const getFoodById = (foodId, foods) => {
  const food = foods.find((item) => item.id === foodId);
  return food ? food : { name: 'N/A', price: 0, image: '' }; // Default values
};

const Account = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [filter, setFilter] = useState('waiting');
  const [selectedOrder, setSelectedOrder] = useState(null);

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
        case 'waiting':
          url = `${api}order/status-waiting/`;
          break;
        case 'shipping':
          url = `${api}order/status-shipping/`;
          break;
        case 'unpaid':
          url = `${api}order/status-unpaid/`;
          break;
        case 'completed':
          url = `${api}order/status-completed/`;
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
        // Lọc đơn hàng theo trạng thái nếu cần thiết
        const filteredOrders = data.filter(order => {
          switch (filter) {
            case 'waiting':
              return order.confirmed === false;
            case 'shipping':
              return order.confirmed === true && order.state === false;
            case 'unpaid':
              return order.confirmed === true && order.pay === false && order.state === false;
            case 'completed':
              return order.confirmed === true && order.pay === true && order.state === true;
            default:
              return true;
          }
        });
        setOrders(filteredOrders);
      } catch (e) {
        setApiError(e.message);
      }
    };

    fetchOrders();
  }, [user, filter]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${api}food/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        if (!response.ok) {
          throw new Error("Lỗi khi lấy thông tin thực phẩm.");
        }
        const data = await response.json();
        setFoods(data);
      } catch (e) {
        setApiError(e.message);
      }
    };

    fetchFoods();
  }, []);

  const getOrderDetailsByAccount = async (orderId) => {
    try {
      const response = await axios.get(`${api}order-details/order/?order=${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setOrderDetails(response.data);
    } catch (e) {
      setApiError("Lỗi khi lấy chi tiết đơn hàng.");
    }
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    getOrderDetailsByAccount(order.id);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedOrder(null);
  };

  const handleConfirmReceived = async (orderId) => {
    try {
      await axios.patch(`${api}order/${orderId}/`, { state: true }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      alert("Xác nhận đã nhận hàng thành công!");
      setFilter('shipping'); // Refresh the "shipping" list
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái đơn hàng.", error);
    }
  };

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
          <h3>{user.username}</h3>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>

      <div className="order-info">
        <h2>Đơn hàng của bạn</h2>
        <div className="order-filters">
          <button onClick={() => handleFilterChange("waiting")}>Chưa xác nhận</button>
          <button onClick={() => handleFilterChange("shipping")}>Đang giao</button>
          <button onClick={() => handleFilterChange("unpaid")}>Chưa thanh toán</button>
          <button onClick={() => handleFilterChange("completed")}>Hoàn thành</button>
        </div>

        {apiError && <p>Có lỗi xảy ra khi lấy đơn hàng: {apiError}</p>}
        {orders.length === 0 ? (
          <p>Không có đơn hàng nào.</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <div className="order-item" key={order.id}>
                <h3>Đơn hàng </h3>
                <p>Ngày đặt hàng: {new Date(order['created_date']).toLocaleDateString()}</p>
                <div className="order-items">
                  {(order.order_details || []).map((detail) => {
                    const food = getFoodById(detail.food, foods);
                    const totalPrice = food.price * detail.quantity;
                    return (
                      <div className="order-detail-item" key={detail.id}>
                        <img
                          src={`${cloudinaryBaseURL}${food.image}`}
                          alt={food.name}
                          className="order-item-image"
                        />
                        <div className="order-item-details">
                          <h4>{food.name}</h4>
                          <p>Giá: {food.price.toLocaleString()} VND</p>
                          <p>Số lượng: {detail.quantity}</p>
                          <p>Tổng cộng: {totalPrice.toLocaleString()} VND</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filter === "shipping" && order.state === false && (
                  <button
                    className="confirm-received-button"
                    onClick={() => handleConfirmReceived(order.id)}
                  >
                    Đã nhận hàng
                  </button>
                )}

                <button className="show-details-button" onClick={() => handleShowDetails(order)}>
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="order-details" style={{ display: 'block' }}>
          <h2>Chi tiết đơn hàng</h2>
          <div className="order-items">
            {orderDetails.map((detail) => {
              const food = getFoodById(detail.food, foods);
              const totalPrice = food.price * detail.quantity;
              return (
                <div className="order-detail-item" key={detail.id}>
                  <img
                    src={`${cloudinaryBaseURL}${food.image}`}
                    alt={food.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h4>{food.name}</h4>
                    <p>Giá: {food.price.toLocaleString()} VND</p>
                    <p>Số lượng: {detail.quantity}</p>
                    <p>Tổng cộng: {totalPrice.toLocaleString()} VND</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
