import React, { useState, useEffect } from 'react';
import axios from 'axios';
const api = 'http://127.0.0.1:8000/'
const OrderDetail = ({ order }) => {
    const [orderDetails, setOrderDetails] = useState([]);

    useEffect(() => {
        // Lấy chi tiết của một đơn hàng từ API
        axios.get(`${api}/order-details/order/?order=${order.id}`)
            .then(response => {
                setOrderDetails(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the order details!', error);
            });
    }, [order]);

    return (
        <div>
            <h3>Order Details for Order #{order.id}</h3>
            <ul>
                {orderDetails.map(detail => (
                    <li key={detail.id}>
                        {detail.food} - Quantity: {detail.quantity} - Amount: {detail.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderDetail;