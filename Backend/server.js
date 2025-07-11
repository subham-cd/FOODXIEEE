import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import 'dotenv/config';

// app config
const app = express();
const port = process.env.PORT || 4000;

// ✅ ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:3000",               // frontend local
  "http://localhost:3001",               // admin local
  "https://foodxieee-frontend.onrender.com", // deployed frontend
  "https://foodxieee-admin.onrender.com"     // deployed admin
];

// ✅ middleware
app.use(express.json());

// ✅ CORS CONFIGURATION
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ CORS not allowed for this origin"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ connect database
connectDB();

// ✅ serve static image files
app.use('/images', express.static('uploads'));

// ✅ API endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// test route
app.get('/', (req, res) => {
  res.send('🚀 Backend is running');
});

// ✅ start server
app.listen(port, () => {
  console.log(`✅ Server is running at http://localhost:${port}`);
});
