import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderDetail from './OrderDetail';
import "../assets/ordermanagement.css";

const api = 'http://127.0.0.1:8000/';

const getAccountNameById = (accountId, accounts) => {
    const account = accounts.find((acc) => acc.id === accountId);
    return account ? (account['first_name'] + " " + account['last_name']) : 'N/A';
};

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    };
    return date.toLocaleDateString('en-GB', options); // Sử dụng 'en-GB' để định dạng ngày/tháng/năm
};

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filter, setFilter] = useState('pending'); // 'pending' hoặc 'confirmed'

    useEffect(() => {
        axios.get(`${api}order/`)
            .then(response => {
                const sortedOrders = response.data.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
                setOrders(sortedOrders);
            })
            .catch(error => {
                console.error('There was an error fetching the orders!', error);
            });

        axios.get(`${api}user/`)
            .then(response => {
                setAccounts(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the accounts!', error);
            });
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const handleConfirmClick = async (orderId) => {
        try {
            await axios.patch(`${api}order/is_confirm/`, { order_id: orderId });
            alert(`Order #${orderId} has been confirmed.`);
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, confirmed: true } : order
            ));
        } catch (error) {
            console.error('There was an error confirming the order!', error);
        }
    };

    const handlePayClick = async (orderId) => {
        try {
            const payDate = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại
            await axios.put(`${api}order/${orderId}/`, { pay: true, pay_date: payDate });
            alert(`Order #${orderId} has been paid.`);
            setOrders(prevOrders => prevOrders.map(order =>
                order.id === orderId ? { ...order, pay: true, pay_date: payDate } : order
            ));
        } catch (error) {
            console.error('There was an error updating the payment status!', error);
        }
    };

    const filteredOrders = orders.filter(order =>
        filter === 'pending' ? !order.confirmed : order.confirmed
    );

    return (
        <div className="order-list-container">
            <h2>Order List</h2>

            <div className="filter-buttons">
                <button onClick={() => setFilter('pending')}>Waiting for confirm</button>
                <button onClick={() => setFilter('confirmed')}>Confirm</button>
            </div>

            <div className="orders-and-details">
                <div className="orders-list">
                    <ul>
                        {filteredOrders.map(order => {
                            const accountId = order.account;
                            const accountName = getAccountNameById(accountId, accounts);

                            return (
                                <li key={order.id}>
                                    <div>
                                        #{order.id} at {formatDateTime(order['created_date'])}
                                        <br/>Address: {order.address}
                                        <br/> Account: {accountName}<br/>
                                        <strong>{order.confirmed ? 'Confirmed' : 'Not Confirmed'}</strong><br/>
                                        {order.pay ? `Paid at ${order.pay_date}` : 'Not Paid'}
                                    </div>
                                    <button className="show-details-button" onClick={() => handleOrderClick(order)}>Show Details</button>
                                    {!order.confirmed && (
                                        <button onClick={() => handleConfirmClick(order.id)}>Confirm</button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="order-details">
                    {selectedOrder && (
                        <>
                            <OrderDetail order={selectedOrder} />
                            {filter === 'confirmed' && !selectedOrder.pay && (
                                <div className="payment-actions">
                                    <button onClick={() => handlePayClick(selectedOrder.id)}>Confirm Paid</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderList;
