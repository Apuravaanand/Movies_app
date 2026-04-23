// routes/movie.routes.js
import express from "express";
import {
  createMovieCard,
  getAllMovieCards,
  getMovieCardById,
  updateMovieCard,
  deleteMovieCard,
  getMovieSuggestions,
} from "../controllers/movie.controller.js";

import { auth } from "../middlewares/auth.js";
import upload from "../utils/upload.js";

const movieRoutes = express.Router();

// READ
movieRoutes.get("/", getAllMovieCards);

// input suggestion
movieRoutes.get("/suggestions", getMovieSuggestions);
// as user click on it
movieRoutes.get("/:id", getMovieCardById);





// CREATE (admin)
movieRoutes.post("/", auth, upload.single("poster"), createMovieCard);

// UPDATE (admin)
movieRoutes.put("/:id", auth, upload.single("poster"), updateMovieCard);

// DELETE (admin)
movieRoutes.delete("/:id", auth, deleteMovieCard);

export default movieRoutes;