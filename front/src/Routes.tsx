import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./Auth/AuthContext";
import Login from "./pages/Login/Login";
import Navbar from "./components/Navbar";
import Produtos from "./pages/Produtos/Produtos";
import Vendas from "./pages/Vendas/Vendas";
import Cupons from "./pages/Cupons/Cupons";
import VendeProdutos from "./pages/Produtos/VendeProdutos";
import Principal from "./pages/Principal";
import Dashboard from "./pages/Dashboard/Dashboard";

type UserRole = "admin" | "vendedor" | "cadastrador";

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { authenticated, user } = useAuth();
  
    if (!authenticated) {
        console.log("Usuário não autenticado, redirecionando para /login");
        return <Navigate to="/login" />;
      }
    
      if (!user || !allowedRoles.includes(user.role as UserRole)) {
        console.log(`Acesso negado para role: ${user?.role}. Redirecionando para /`);
        return <Navigate to="/" />;
      }
  
    return <Outlet />;
  };

const AppRoutes = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login"/>} />
                    <Route path="/login" element={<Login />} />

                    {/* Rotas para VENDEDOR */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'vendedor']} />}>
                        <Route path="/produtos" element={<><Navbar /><VendeProdutos /></>} />
                        <Route path="/vendas" element={<><Navbar /><Vendas /></>} />
                        <Route path="/cupons" element={<><Navbar /><Cupons /></>} />
                    </Route>

                    {/* Rotas para CADASTRADOR */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'cadastrador']} />}>
                        <Route path="/cadastro" element={<><Navbar /><Produtos /></>} />
                        <Route path="/vendas" element={<><Navbar /><Vendas /></>} />
                    </Route>

                    {/* Rota para DASHBOARD */}
                    <Route element={<ProtectedRoute allowedRoles={['admin', 'vendedor', 'cadastrador']} />}> 
                        <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default AppRoutes;