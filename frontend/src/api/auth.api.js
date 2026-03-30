import api from "./index.js";

// Login user
export const login = (payload) => api.post("/auth/login", payload);

// Signup user
export const signup = (payload) => api.post("/auth/signup", payload);

// No logout here, handle logout in frontend (Navbar or AuthContext)