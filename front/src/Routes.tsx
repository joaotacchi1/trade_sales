import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./Auth/AuthContext";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar";
import Produtos from "./pages/Produtos/Produtos";
import Vendas from "./pages/Vendas/Vendas";
import Cupons from "./pages/Cupons/Cupons";

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
                        <Route path="/produtos" element={<><Navbar /><Produtos /></>} />
                        <Route path="/vendas" element={<><Navbar /><Vendas /></>} />
                        <Route path="/cupons" element={<><Navbar /><Cupons /></>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default AppRoutes;