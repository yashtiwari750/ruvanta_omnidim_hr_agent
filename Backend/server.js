import express from "express";
import dotenv from "dotenv";
import userRoute from './routes/userRoutes.js';
import omnidimProxy from './routes/omnidimProxy.js';
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

dotenv.config();
import Cors from "cors";


const app = express();

app.use(Cors(
   {
    origin:'http://localhost:5173',
    credentials:true,
      methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
   }
))
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
