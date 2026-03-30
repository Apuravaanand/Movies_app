import express from "express";
import { login, signup } from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.js";


const authRoutes = express.Router();

// ---------- AUTH ----------
authRoutes.post("/signup", signup);
//     api.post("/auth/signup", data);
authRoutes.post("/login", login);
//     api.post("/auth/login", data);


export default authRoutes;
