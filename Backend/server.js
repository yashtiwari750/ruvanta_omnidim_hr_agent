import express from "express";
import dotenv from "dotenv";
import userRoute from './routes/userRoutes.js';
import omnidimProxy from './routes/omnidimProxy.js';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";           // ✅ Add this line

dotenv.config();
import Cors from "cors";


const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://ruvanta-hr-agent.vercel.app",
  "https://ruvanta-omnidim-hr-agent-pawr.vercel.app" // your new frontend URL
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const PORT  = process.env.PORT 
const MONGODB_URI = process.env.MONGODB_URI

app.use('/api/users', userRoute)
app.use('/api/omnidim', omnidimProxy)

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
