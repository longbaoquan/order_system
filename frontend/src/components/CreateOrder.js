import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders';

export default function CreateOrder() {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const updateItem = (index, field, value) => {
    const next = items.map((item, i) =>
      i === index ? { ...item, [field]: field === 'name' ? value : Number(value) } : item
    );
    setItems(next);
  };

  const addItem = () => setItems([...items, { name: '', quantity: 1, price: 0 }]);
  const removeItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Recalculate total whenever items change
  React.useEffect(() => {
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    setTotalAmount(total);
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = items.filter((i) => i.name.trim());
    if (!customerName.trim()) { alert('请输入客户姓名'); return; }
    if (validItems.length === 0) { alert('请至少添加一个商品'); return; }

    setSubmitting(true);
    try {
      await axios.post(API_URL, { customerName, items: validItems, totalAmount });
      setCustomerName('');
      setItems([{ name: '', quantity: 1, price: 0 }]);
      alert('订单创建成功！');
    } catch (err) {
      alert('创建失败: ' + (err.response?.data?.message || err.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="create-section">
      <h2>新建订单</h2>
      <form onSubmit={handleSubmit}>
        <label>客户姓名
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="输入客户姓名" required />
        </label>

        <fieldset>
          <legend>商品明细</legend>
          {items.map((item, idx) => (
            <div key={idx} className="item-row">
              <input placeholder="商品名" value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} required />
              <input type="number" min="1" placeholder="数量" value={item.quantity} onChange={(e) => updateItem(idx, 'quantity', e.target.value)} required style={{ maxWidth: 80 }} />
              <input type="number" min="0" step="0.01" placeholder="单价" value={item.price} onChange={(e) => updateItem(idx, 'price', e.target.value)} required style={{ maxWidth: 100 }} />
              <button type="button" className="btn-remove" onClick={() => removeItem(idx)}>X</button>
            </div>
          ))}
          <button type="button" className="btn-add-item" onClick={addItem}>+ 添加商品</button>
        </fieldset>

        <div className="form-total">
          总金额：<strong>${totalAmount.toFixed(2)}</strong>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? '提交中...' : '提交订单'}
        </button>
      </form>
    </section>
  );
}
