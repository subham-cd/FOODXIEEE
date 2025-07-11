import React, { useState, useEffect } from 'react';
import './Order.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { assets, url } from "../../assets/assets.js";  // ✅ import url here

const Order = () => {  // ⛔ removed ({ url }) from here
  const [orders, setOrders] = useState([]);

  const fetchAllorders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`); // ✅ template literal
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch orders");
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const response = await axios.post(`${url}/api/order/status`, {
        orderId,
        status: e.target.value
      });
      if (response.data.success) {
        await fetchAllorders();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    fetchAllorders();
  }, []);

  return (
    <div className="order add">
      <ToastContainer />
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.map((order, index) => (
          <div key={index} className="order-item">
            <img src={assets.parcel_icon} alt="parcel" />
            <div>
              <p className="order-item-food">
                {order.items.map((item, i) =>
                  i === order.items.length - 1
                    ? `${item.name} x ${item.quantity}`
                    : `${item.name} x ${item.quantity}, `
                )}
              </p>
              <p className="order-item-name">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="order-item-address">
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city + ", " +
                    order.address.state + ", " +
                    order.address.country + ", " +
                    order.address.zipcode}
                </p>
              </div>
              <p className="order-item-phone">{order.address.phone}</p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>${order.amount}</p>
            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
