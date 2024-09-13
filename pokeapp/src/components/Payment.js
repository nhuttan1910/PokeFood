import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../assets/payment.css';

const Payment = () => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const params = {
        amount: queryParams.get('amount'),
        orderId: queryParams.get('orderId'),
        orderInfo: queryParams.get('orderInfo'),
        orderType: queryParams.get('orderType'),
        partnerCode: queryParams.get('partnerCode'),
        requestId: queryParams.get('requestId'),
        responseTime: queryParams.get('responseTime'),
        resultCode: queryParams.get('resultCode'),
        transId: queryParams.get('transId'),
        signature: queryParams.get('signature'),
      };

      try {
        const response = await axios.post('http://127.0.0.1:8000/payment/payment-callback/', params, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setStatus('success');
          setMessage('Thanh toán thành công.');
        } else {
          setStatus('error');
          setMessage('Thanh toán thất bại.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Có lỗi xảy ra khi xử lý thanh toán.');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="payment-container">
      <h1>{status === 'success' ? 'Thanh toán thành công' : 'Thanh toán thất bại'}</h1>
      <p>{status === 'success' ? 'Đơn hàng sẽ sớm được giao đến bạn. Chúc bạn ngon miệng!' : 'Vui lòng thử lại sau!!!'}</p>
      <button onClick={() => navigate('/')}>Quay lại trang chủ</button>
    </div>
  );
};

export default Payment;
