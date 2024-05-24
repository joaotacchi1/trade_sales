import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Navbar.css';
import { useAuth } from '../Auth/AuthContext';

const Navbar = () => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    };

    const logout = useAuth().logout;

    return (
        <nav className='d-flex justify-content-center navbar2'>
            <div className={`navbar-mobile-button ${isMobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
                <span></span>
                <span></span>
                <span></span>
            </div>
            <ul className={`navbar-list ${isMobileMenuOpen ? 'open' : ''}`}>
                <li><Link to="/cadastro" onClick={toggleMobileMenu}>Cadastro</Link></li>
                <li><Link to="/produtos" onClick={toggleMobileMenu}>Produtos</Link></li>
                <li><Link to="/vendas" onClick={toggleMobileMenu}>Vendas</Link></li>
                <li><Link to="/cupons" onClick={toggleMobileMenu}>Cupons</Link></li>
            </ul>
            <div className="user-actions">
                <span>Olá, {useAuth().user?.name}</span>
                <button className='btn btn-danger' onClick={logout}>
                    <Link to="/login" className='btn' >Sair</Link>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;