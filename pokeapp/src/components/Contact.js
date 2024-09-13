import React, { useState, useEffect } from 'react';
import '../assets/contact.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAppleWhole, faSquarePhone, faSquareEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Contact = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreInfo = () => {
      try {
        const storedInfo = JSON.parse(localStorage.getItem("storeInfo"));
        if (storedInfo && Array.isArray(storedInfo) && storedInfo.length > 0) {
          setStore(storedInfo[0]); // Lấy đối tượng đầu tiên trong mảng
        } else {
          setError("Không có thông tin cửa hàng.");
        }
      } catch (e) {
        setError("Lỗi khi phân tích thông tin cửa hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  if (loading) {
    return <p>Đang tải dữ liệu...</p>;
  }

  if (error) {
    return <p>Có lỗi xảy ra: {error}</p>;
  }

  if (!store) {
    return <p>Không có thông tin cửa hàng.</p>;
  }

  return (
    <div className="container">
      <div className="container-contact">
        <div className="contact-title">
          <h1 className="contact-h1">LIÊN HỆ {store.name}</h1>
        </div>
        <div className="contact-content">
          <div className="contact-item">
            <h3 className="item-title">Thông tin liên hệ</h3>
            <ul className="item-array">
              <li className="item-item">
                <FontAwesomeIcon icon={faAppleWhole} className="contact-icon" />
                {store.name}
              </li>
              <li className="item-item">
                <FontAwesomeIcon icon={faSquarePhone} className="contact-icon" />
                {store.phone}
              </li>
              <li className="item-item">
                <FontAwesomeIcon icon={faSquareEnvelope} className="contact-icon" />
                {store.email_contact}
              </li>
              <li className="item-item">
                <FontAwesomeIcon icon={faLocationDot} className="contact-icon" />
                {store.address}
              </li>
            </ul>
          </div>
          <div className="contact-item">
            <h3 className="item-title">Gửi tin nhắn cho chúng tôi</h3>
            <div className="item-list">
              <div className="item-list1">
                <input type="text" placeholder="Họ Tên *" className="item-input1" />
              </div>
              <div className="item-list1">
                <input type="text" placeholder="Số điện thoại *" className="item-input1" />
              </div>
            </div>
            <div className="item-list">
              <div className="item-list2">
                <input type="text" placeholder="Email *" className="item-input1" />
              </div>
            </div>
            <div className="item-list">
              <div className="item-list3">
                <textarea placeholder="Tin nhắn *" className="item-input2" cols="5" rows="3"></textarea>
              </div>
            </div>
            <div className="item-list">
              <button className="item-button">Gửi</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
