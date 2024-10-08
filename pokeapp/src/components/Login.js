import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';
import '../assets/login.css';

const Login = ({ onLoginSuccess }) => {
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
          //client_id: 'JVueeMClIZzEAiLQB0efRHvFQuN9x2nfZe2CFfJ0',
          //client_secret: 'vKfJNyVrvfTYvzhjtx5yioGVG3g0csXzXBRdwW5dKLv2QvlXBHEbqRJylQsyyEak0L1x0S1hyN3bxc8n3XIxh8Ua0HtCT95WsDLRxgVwOAZtmKJtNDgWrr6ABsgy15r9',
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

      const userData = await userResponse.json();
      console.log(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      onLoginSuccess(accessToken);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
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
          <button
            type="button"
            className="register-button"
            onClick={() => navigate('/register')}
          >
            Register
          </button>
        </div>
        <div className="google-login">
          <button
            type="button"
            className="google-login-button"
          >
            Login with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
