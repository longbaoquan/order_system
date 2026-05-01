import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

const statusLabels = {
  pending: '待处理',
  confirmed: '已确认',
  shipped: '已发货',
  delivered: '已送达',
};

const statusColors = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#10b981',
};

// ── Modal for editing an order ──────────────────────────────

function EditModal({ order, onClose, onSave }) {
  const [customerName, setCustomerName] = useState(order.customerName);
  const [totalAmount, setTotalAmount] = useState(order.totalAmount);
  const [status, setStatus] = useState(order.status);
  const [items, setItems] = useState(
    order.items.length ? order.items : [{ name: '', quantity: 1, price: 0 }]
  );

  const updateItem = (index, field, value) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: field === 'name' ? value : Number(value) } : item
    );
    setItems(next);
  };

  const addItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      customerName,
      totalAmount: Number(totalAmount),
      status,
      items: items.filter((i) => i.name.trim()),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>编辑订单</h3>
        <form onSubmit={handleSubmit}>
          <label>客户姓名
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </label>

          <label>状态
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {Object.entries(statusLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend>商品明细</legend>
            {items.map((item, idx) => (
              <div key={idx} className="item-row">
                <input placeholder="商品名" value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} required />
                <input type="number" min="1" placeholder="数量" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} required />
                <input type="number" min="0" step="0.01" placeholder="单价" value={item.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} required />
                <button type="button" className="btn-remove" onClick={() => removeItem(idx)}>X</button>
              </div>
            ))}
            <button type="button" className="btn-add-item" onClick={addItem}>+ 添加商品</button>
          </fieldset>

          <label>总金额
            <input type="number" min="0" step="0.01" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} required />
          </label>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>取消</button>
            <button type="submit">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Order List ────────────────────────────────────────

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL);
      setOrders(res.data);
    } catch (err) {
      console.error('加载订单失败:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!confirm('确定要删除这条订单吗？')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setOrders(orders.filter((o) => o._id !== id));
    } catch (err) {
      alert('删除失败');
    }
  };

  const handleUpdate = async (payload) => {
    try {
      const res = await axios.patch(`${API_URL}/${editingOrder._id}`, payload);
      setOrders(orders.map((o) => (o._id === editingOrder._id ? res.data : o)));
      setEditingOrder(null);
    } catch (err) {
      alert('更新失败');
    }
  };

  if (loading) return <p className="loading">加载中...</p>;

  return (
    <section className="order-list-section">
      <h2>订单列表</h2>
      {orders.length === 0 ? (
        <p className="empty">暂无订单</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>客户</th>
              <th>商品</th>
              <th>金额</th>
              <th>状态</th>
              <th>创建时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.customerName}</td>
                <td>
                  {order.items.map((item, i) => (
                    <span key={i}>
                      {item.name} x{item.quantity}
                      {i < order.items.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </td>
                <td>${order.totalAmount.toFixed(2)}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: statusColors[order.status] }}
                  >
                    {statusLabels[order.status]}
                  </span>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString('zh-CN')}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => setEditingOrder(order)}>编辑</button>
                  <button className="btn-delete" onClick={() => handleDelete(order._id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingOrder && (
        <EditModal
          order={editingOrder}
          onClose={() => setEditingOrder(null)}
          onSave={handleUpdate}
        />
      )}
    </section>
  );
}
