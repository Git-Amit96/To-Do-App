import React from "react";
import { Navigate } from "react-router-dom";



const ProtectedRoute = ({ isLoggedIn, children }) => {
    // Agar user logged in nahi hai, redirect to login page
    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    // Logged in hai to content render karega
    return children;
};

export default ProtectedRoute;