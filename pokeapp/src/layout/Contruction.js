import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';

const Construction = () => {
  const [storeInfo, setStoreInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchStoreInfo = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/store/");
        if (!response.ok) {
          throw new Error("Failed to fetch store information");
        }
        const data = await response.json();
        console.log(data);
        localStorage.setItem("storeInfo", JSON.stringify(data));

        const storedInfo = localStorage.getItem("storeInfo");
        console.log(storedInfo);

        if (Array.isArray(data) && data.length > 0) {
          setStoreInfo(data[0]);

        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error.message);
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

  return (
    <div className="container-intro">
      {storeInfo ? (
        <>
          <h3 className="intro-content">{storeInfo.name}</h3>
          <p className="intro-text">{storeInfo.introduction}</p>
          <Link to="/menu" className="intro-btn">
            <button className="intro-btn">Đặt hàng</button>
          </Link>
        </>
      ) : (
        <p>Không có thông tin cửa hàng.</p>
      )}
    </div>
  );
};

export default Construction;
