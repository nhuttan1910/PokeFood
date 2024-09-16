// src/components/ManagerLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';
import '../assets/login.css';

const ManagerLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:8000/o/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'password',
          username: username,
          password: password,
          client_id: 'wQH1wAdg0DCu6Z3nTZYF4vIJTOQpHWVvUO6X5qAK',
          client_secret: 'Hxc5hmxcODDfMbLYbpfhrD2i6vWui85QpCvOcYDJ9BL1yn6YSkcSWz2ZIIXY92iEnJTfmvbHgUHPU5gYI7zou6XvAqintfZGwiUlAFuzRQzydnecpzCXDM21ykKjwIju',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error_description || 'Thông tin không hợp lệ!');
      }

      const data = await response.json();
      const accessToken = data.access_token;

      // Lưu access token vào localStorage
      localStorage.setItem('access_token', accessToken);

      // Lấy thông tin người dùng sau khi đăng nhập thành công
      const userResponse = await fetch('http://127.0.0.1:8000/user/current-user/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Không thể lấy thông tin người dùng!');
      }

      const userData = await userResponse.json(); // Đọc dữ liệu dưới dạng JSON
      localStorage.setItem('user', JSON.stringify(userData)); // Lưu dữ liệu dưới dạng chuỗi JSON

      // Kiểm tra xem người dùng có phải là admin không
      if (userData.username === "admin") {
        navigate('/manager'); // Điều hướng đến trang quản lý nếu là admin
      } else {
        throw new Error('Không có quyền truy cập vào trang quản lý.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Manager Login</h2>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="login-buttons">
          <button type="submit" className="login-button">Login</button>
        </div>
      </form>
    </div>
  );
};

export default ManagerLogin;
