import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';
import '../assets/register.css';

const Register = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu không trùng khớp. Vui lòng nhập lại!");
      return;
    }

    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('address', address);
    if (avatar) formData.append('avatar', avatar);

    try {
      const response = await fetch('http://127.0.0.1:8000/user/create-account/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Đăng ký thất bại!!!');
      }

      setSuccess('Bạn đã đăng ký tài khoản thành công. Bạn có thể đăng nhập bây giờ.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleRegister}>
        <div className="form-group">
            <label htmlFor="firstname">First Name:</label>
            <input type="text" placeholder="First Name" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" placeholder="Last Name" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="confirmpassword">Confirm Password:</label>
            <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <input type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files[0])} />
        <div className="login-buttons">
          <button type="submit" className="login-button">Register</button>
          <button
            type="button"
            className="register-button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
