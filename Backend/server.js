// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import userRoutes from "./routes/userRoutes.js";
// import cookieParser from "cookie-parser";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // ✅ CORS setup
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://ruvanta-hr-agent.vercel.app",
//   "https://ruvanta-omnidim-hr-agent-pawr.vercel.app",
// ];

// app.use((req, res, next) => {
//   console.log("🛰️ Request Origin:", req.headers.origin);
//   next();
// });

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

// // ✅ Handles preflight automatically for all routes
// app.options(/.*/, cors());


// // ✅ Common middleware
// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ✅ Routes
// app.use("/api/users", userRoutes);

// // ✅ Database connection
// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("✅ MongoDB connected successfully");
//     app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//   })
//   .catch((err) => console.log(err));




import express from "express";
import dotenv from "dotenv";
import userRoute from './routes/userRoutes.js';
import mongoose from "mongoose";
import Cors from "cors";

dotenv.config();


const app = express();

// added cors access point so that our backend allow our frontend website 

const allowedOrigins = [
  "http://localhost:5173",
  "https://ruvanta-omnidim-hr-agent-pawr.vercel.app"
];

app.use(Cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT  = process.env.PORT 
const MONGODB_URI = process.env.MONGODB_URI

app.use('/api/users', userRoute)

// try {
//     mongoose.connect(URI).then(() => {
//         console.log('Connected to MongoDB')
//     })
// } catch (error) {

//     console.log(`Mongodb not connected: ${error.message}`);
    
// }
try {
    mongoose.connect(MONGODB_URI)
.then(
    console.log("mongodb connection")
)
} catch (error) {
    console.log(`Mongodb not connected: ${error.message}`);
    
}


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Server is listening on port  ${PORT}`)
})

