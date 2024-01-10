import express from "express";
import bodyParser from 'body-parser';
import * as dotenv from "dotenv";
import AdminRoutes from "./routes/admin.js"
import UserRoutes from "./routes/user.js";
import DealershipRoutes from "./routes/dealership.js";
import UserApiRoutes from "./routes/userApi.js";
import DealershipApiRoutes from "./routes/dealershipApi.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/admin', AdminRoutes);
app.use('/user', UserRoutes);
app.use('/dealership', DealershipRoutes);
app.use('/users', UserApiRoutes);
app.use('/dealers', DealershipApiRoutes);


const runServer = () => {
     app.listen(process.env.PORT, () => {
          console.log(`Server is running on http://localhost:${process.env.PORT}`);
        });
}


runServer()