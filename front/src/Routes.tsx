import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./Auth/AuthContext";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar";

const AdminRoutes = () => {
    const { authenticated, user } = useAuth();

    return (
        authenticated && user && user.role == 'admin' ? <Outlet /> : <Navigate to="/login" />
    )
};

const AppRoutes = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<><Login /></>} />
                    <Route element={<AdminRoutes />}>
                        <Route path="/dashboard" element={<><Navbar /></>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default AppRoutes;