import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../assets/ordermanagement.css"
const api = 'http://127.0.0.1:8000/';
const OrderDetail = ({ order }) => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [foods, setFoods] = useState([]); // Lưu trữ danh sách các món ăn
    const [totalAmount, setTotalAmount] = useState(0);

    // Hàm lấy tên món ăn từ foodId và danh sách foods
    const getFoodNameById = (foodId, foods) => {
        const food = foods.find((foodItem) => foodItem.id === foodId);
        return food ? food.name : 'Unknown';
    };

    useEffect(() => {
        // Lấy chi tiết của một đơn hàng từ API
        axios.get(`${api}/order-details/order/?order=${order.id}`)
            .then(response => {
                setOrderDetails(response.data);

                // Tính tổng amount
                const total = response.data.reduce((acc, detail) => acc + detail.amount, 0);
                setTotalAmount(total);
            })
            .catch(error => {
                console.error('There was an error fetching the order details!', error);
            });

        // Lấy danh sách các món ăn từ API
        axios.get(`${api}/food/`)
            .then(response => {
                setFoods(response.data); // Lưu danh sách món ăn vào state
            })
            .catch(error => {
                console.error('There was an error fetching the food list!', error);
            });
    }, [order]);

    return (
        <div className="order-details-container">
            <h3>Details of Order #{order.id}</h3>
            <ul>
                {orderDetails.map(detail => (
                    <li key={detail.id}>
                        Food name: {getFoodNameById(detail.food, foods)}
                        <br/>Quantity: {detail.quantity}
                        <br/>Amount: {detail.amount}
                    </li>
                ))}
            </ul>
            <h4>Total Amount: {totalAmount}</h4>
        </div>
    );
};

export default OrderDetail;
