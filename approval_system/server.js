import express from "express";
const app = express();
import "dotenv/config.js";
import mongoose from "mongoose";
import { UserRouter } from "./server/user/routes/userRouter.js";
import { TicketRoutes } from "./server/ticket/routes/ticketRouter.js";
import { DepartmentRouter } from "./server/department/routes/departmentRouter.js";
import { BranchRouter } from "./server/branch/routes/branchRouter.js";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import path from "path"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())


app.use('/api/users', UserRouter);
app.use('/api/ticket', TicketRoutes)
app.use('/api/department',DepartmentRouter)
app.use('/api/branch',BranchRouter)
app.use(express.static(path.join(__dirname, "/client/dist")))


app.get("*",(req,res) => {
  res.sendFile(path.join(__dirname, "/client/dist/index.html"));
})

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})


// mongoose
//   .connect(process.env.MONGO_URL,{dbName: "approval_system"})
//   .then(()=> {
//     console.log("Connection on mongodb is on.")
//   })
//   .catch((err) => {
//     console.log(err)
//   })




mongoose.connect(process.env.MONGO_URL, {
  dbName: "approval_system",
  tlsInsecure: false,
  // useNewUrlParser: true, 
  // useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));


app.listen(process.env.PORT,()=> {
  console.log(`Your application is running on port ${process.env.PORT}`)
})
