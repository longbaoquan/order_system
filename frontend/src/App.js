import React, { useState } from 'react';
import './App.css';
import OrderList from './components/OrderList';
import CreateOrder from './components/CreateOrder';

function App() {
  const [activeTab, setActiveTab] = useState('list');

  return (
    <div className="App">
      <header className="App-header">
        <h1>订单管理系统</h1>
      </header>
      <nav className="tabs">
        <span className={`tab ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>订单列表</span>
        <span className={`tab ${activeTab === 'create' ? 'active' : ''}`} onClick={() => setActiveTab('create')}>新建订单</span>
      </nav>
      <main>
        {activeTab === 'list' && <OrderList />}
        {activeTab === 'create' && <CreateOrder />}
      </main>
    </div>
  );
}

export default App;
