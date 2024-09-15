import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderDetail from './OrderDetail';
import '../assets/OrderList.css';
const api = 'http://127.0.0.1:8000/';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        axios.get(`${api}order/`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleConfirmClick = async (orderId) => {
        try {
            await axios.patch(`${api}order/is_confirm/`, { order_id: orderId });
            alert(`Order #${orderId} has been confirmed.`);
            // Cập nhật trạng thái confirmed cho order trong danh sách
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, confirmed: true } : order
            ));
        } catch (error) {
            console.error('There was an error confirming the order!', error);
        }
    };

    return (
        <div className="order-list-container">
            <h2>Order List</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        Order #{order.id} - {order.address} - {order.account} - 
                        <strong>{order.confirmed ? 'Confirmed' : 'Not Confirmed'}</strong>
                        <button onClick={() => handleOrderClick(order)}>Show Details</button>
                        {!order.confirmed && (
                            <button onClick={() => handleConfirmClick(order.id)}>Confirm</button>
                        )}
                    </li>
                ))}
            </ul>

            {selectedOrder && <OrderDetail order={selectedOrder} />}
        </div>
    );
};

export default OrderList;
