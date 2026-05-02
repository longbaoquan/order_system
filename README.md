# 订单管理系统

一个全栈订单管理系统，基于 Node.js、Express、MongoDB 和 React 构建。

## 功能特性

- **订单管理**：创建、查看、编辑、删除订单
- **订单状态追踪**：待处理 → 已确认 → 已发货 → 已送达
- **多商品支持**：每个订单可包含多个商品，自动计算总金额
- **实时数据同步**：前后端通过 RESTful API 通信

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 18、React Hooks、Axios |
| 后端 | Node.js、Express.js |
| 数据库 | MongoDB、Mongoose ORM |
| 其他 | CORS、dotenv |

## 项目结构

```
d--order-system/
├── backend/                  # 后端服务
│   ├── models/
│   │   └── Order.js          # 订单数据模型
│   ├── routes/
│   │   └── orders.js         # 订单路由（CRUD API）
│   ├── server.js             # 服务入口
│   ├── .env                  # 环境变量配置
│   └── package.json
│
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/
│   │   │   ├── CreateOrder.js    # 新建订单组件
│   │   │   └── OrderList.js      # 订单列表组件（含编辑弹窗）
│   │   ├── App.js            # 主应用（Tab 切换）
│   │   └── index.js          # 入口文件
│   ── package.json
│
└── README.md
```

## API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/orders` | 获取所有订单 |
| POST | `/api/orders` | 创建新订单 |
| GET | `/api/orders/:id` | 获取指定订单 |
| PATCH | `/api/orders/:id` | 更新订单 |
| DELETE | `/api/orders/:id` | 删除订单 |

### 订单数据模型

```javascript
{
  customerName: String,       // 客户姓名（必填）
  items: [{
    name: String,             // 商品名
    quantity: Number,         // 数量
    price: Number,            // 单价
  }],
  totalAmount: Number,        // 总金额（必填）
  status: String,             // 状态：pending | confirmed | shipped | delivered
  createdAt: Date,            // 创建时间
}
```

## 快速开始

### 环境要求

- Node.js 16+
- MongoDB 5+

### 1. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端（新开一个终端）
cd frontend
npm install
```

### 2. 配置环境变量
```
MONGO_URI=.env
PORT=5000
```

根据实际情况修改 `MONGO_URI` 即可。

### 3. 启动 MongoDB

确保本地 MongoDB 服务正在运行。Windows 上：

```bash
net start MongoDB
```

### 4. 启动后端

```bash
cd backend
npm run dev
```

服务运行在 `你的env`

### 5. 启动前端

```bash
cd frontend
npm start
```

浏览器自动打开 `你的env`

## 使用指南

### 新建订单

1. 点击「新建订单」标签
2. 填写客户姓名
3. 添加商品信息（商品名、数量、单价）
4. 可点击「+ 添加商品」追加多个商品
5. 总金额会自动计算
6. 点击「提交订单」

### 管理订单

1. 点击「订单列表」标签查看所有订单
2. **编辑**：点击「编辑」按钮，修改客户信息、状态或商品明细
3. **删除**：点击「删除」按钮（会弹出确认提示）

### 订单状态

| 状态 | 说明 |
|------|------|
| 待处理 (pending) | 订单刚创建 |
| 已确认 (confirmed) | 订单已确认 |
| 已发货 (shipped) | 商品已发出 |
| 已送达 (delivered) | 订单完成 |

## 注意事项

- 前端 API 地址硬编码为 `http://localhost:5000`，如需修改请编辑：
  - `frontend/src/components/OrderList.js`
  - `frontend/src/components/CreateOrder.js`
- 删除 `node_modules` 后需要重新 `npm install`
