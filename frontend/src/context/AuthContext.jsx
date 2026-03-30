import { createContext, useState, useEffect } from "react";

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    // Load user from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) setUser(JSON.parse(storedUser));
    }, []);

    const login = (userData, authToken) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", authToken);
        setUser(userData);
        setToken(authToken);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, token, login, logout }} 
        >
            {children}
        </AuthContext.Provider>
    );
};