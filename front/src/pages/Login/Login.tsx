import React, { useEffect, useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { login, authenticated } = useAuth();
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(loginInput, passwordInput);
      // Redireciona baseado na role do usuário
      const { user } = useAuth();
      console.log(user);
      if (user?.role === 'admin') {
        navigate('/produtos');
      } else if (user?.role === 'vendedor') {
        navigate('/vendas');
      } else if (user?.role === 'cadastrador') {
        navigate('/cadastro');
      } else {
        navigate('/'); // Redireciona para uma página padrão, caso não tenha role válida
      }
    } catch (error) {
      if ((error as any).response) {
        if ((error as any).response.status === 401) {
          setError('Senha incorreta');
        } else if ((error as any).response.status === 404) {
          setError('Usuário não encontrado');
        } else {
          setError('Ocorreu um erro durante o login');
        }
      } else {
        setError('Ocorreu um erro durante o login');
      }
    }
  };
  useEffect(() => {
    // Verifique se o usuário já está logado
    const role = localStorage.getItem('role');
    if (authenticated) {
      if (role === 'admin') {
        navigate('/produtos');
      } else if (role === 'vendedor') {
        navigate('/vendas');
      } else if (role === 'cadastrador') {
        navigate('/cadastro');
      } else {
        navigate('/'); // Redireciona para uma página padrão, caso não tenha role válida
      }  // Redirecione para /funcionarios se o usuário estiver logado
    }
  }, [authenticated, navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="login" className="form-label">Login:</label>
                  <input
                    type="text"
                    id="login"
                    className="form-control"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Senha:</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                  />
                </div>
                {error && <div className="text-danger mb-3">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">Entrar</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
