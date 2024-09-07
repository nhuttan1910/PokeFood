import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderDetail from './OrderDetail';

const api = 'http://127.0.0.1:8000/';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        // Lấy danh sách các đơn hàng từ API
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

    const handleConfirmClick = (orderId) => {
        axios.post(`${api}is_confirm/?order_id=${orderId}/`)
            .then(response => {
                // Nếu cần, bạn có thể cập nhật lại danh sách đơn hàng hoặc chỉ cập nhật trạng thái đơn hàng đã xác nhận
                setOrders(prevOrders => prevOrders.map(order =>
                    order.id === orderId ? { ...order, is_confirmed: true } : order
                ));
            })
            .catch(error => {
                console.error('There was an error confirming the order!', error);
            });
    };

    return (
        <div>
            <h2>Order List</h2>
            <ul>
                {orders.map(order => (
                    <li key={order.id}>
                        Order #{order.id} - {order.address} - {order.account} - {order.confirmed}
                        {!order.is_confirmed && (
                            <button onClick={() => handleConfirmClick(order.id)}>Confirm</button>
                        )}
                        <button onClick={() => handleOrderClick(order)}>Show</button>
                    </li>
                ))}
            </ul>

            {selectedOrder && <OrderDetail order={selectedOrder} />}
        </div>
    );
};

export default OrderList;
