import { React, useEffect, useState } from 'react';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faDiscord } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
  const [logo, setLogo] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/store');
        const data = await res.json();
        if (data && data.length > 0) {
          const cloudinaryBaseURL = 'https://res.cloudinary.com/di0aqgf2u/';
          setLogo(cloudinaryBaseURL + data[0].logo);
        }
      } catch (error) {
        console.error('Failed to fetch logo URL:', error);
      }
    };

    fetchLogo();
  }, []);
  return (
    <footer class="footer">
            <div class="footer-container">
                <div class="footer-container-40">
                    <div className="footer-container-40-header">
                        <img src={logo} alt="" className="footer-container-icon" />
                    </div>
                    <h1 class="footer-container-text">Đăng Ký Nhận Thông Tin Khuyến Mãi</h1>
                    <div class="footer-container-content">
                        <input type="text" class="footer-container-input" placeholder="Nhập email" />
                        <div class="footer-container-btn">
                            <button class="footer-container-button">Gửi ngay</button>
                        </div>
                    </div>
                </div>
                <div class="footer-container-20">
                    <div class="footer-container-20-info">
                        <h3 class="footer-container-20-title">Thông Tin</h3>
                        <ul class="footer-list">
                            <li class="footer-item">
                                    <a href="">Tin tức</a>
                            </li>
                            <li class="footer-item">
                                <a href="">Khuyến mãi</a>
                            </li>
                            <li class="footer-item">
                                <a href="">Tuyển dụng</a>
                            </li>
                            <li class="footer-item">
                                <a href=""> Nhượng quyền</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="footer-container-20">
                    <h3 class="footer-container-20-title">Hỗ trợ</h3>
                    <ul class="footer-list">
                        <li class="footer-item">
                            <a href="">Điều khoản sử dụng</a>
                        </li>
                        <li class="footer-item">
                            <a href="">Chính sách bảo mật</a>
                        </li>
                        <li class="footer-item">
                            <a href="">Chính sách giao hàng</a>
                        </li>
                        <li class="footer-item">
                            <a href="">Chăm sóc khách hàng</a>
                        </li>
                    </ul>
                </div>
                <div class="footer-container-20">
                    <h3 class="footer-container-20-title">Theo dõi</h3>
                    <ul class="footer-list">
                        <li class="footer-item">
                            <a href="" class="footer-item-link">
                                <FontAwesomeIcon icon={faFacebook} /> Facebook
                            </a>
                        </li>
                        <li class="footer-item">
                            <a href="" class="footer-item-link">
                                <FontAwesomeIcon icon={faInstagram} /> Instagram
                            </a>
                        </li>
                        <li class="footer-item">
                            <a href="" class="footer-item-link">
                                <FontAwesomeIcon icon={faDiscord} /> Discord
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="footer-end">
                <i class="footer-end-icon fa-regular fa-copyright"></i>
                <h4 class="footer-end-text">2024 PokeFood All Rights Reserved</h4>
            </div>
        </footer>
    );
  };

export default Footer;
