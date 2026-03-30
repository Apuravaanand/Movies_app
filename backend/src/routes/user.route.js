import express from "express";
import { toggleFavorite, getFavorites } from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.js";

const userRouters = express.Router();

userRouters.patch("/favorites/:movieId", auth, toggleFavorite);
userRouters.get("/favorites", auth, getFavorites);

export default userRouters;