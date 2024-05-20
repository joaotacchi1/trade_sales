import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import api from "../../services/useApi";
import { useNavigate } from "react-router-dom";

const Produtos: React.FC = () => {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [filtroName, setFiltroName] = useState('');;
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products/');
            setProdutos(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleFilterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroName(event.target.value)
    }

    const handleDeleteProduct = async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container">
            <div>
                <input type="text" className="form-control col" placeholder="Filtrar por nome" onChange={handleFilterNameChange} />
            </div>
            <div style={{ height: '600px' }}>
                <div className="h-100 overflow-y-auto border ">
                    <table className="table table-striped table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th className="col">Code</th>
                                <th className="col">Descrição</th>
                                <th className="col">Quantidade</th>
                                <th className="col">Vl Unit</th>
                                <th className="col">Cadastro</th>
                                <th className="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*Filter by name, type and sector*/}
                            {produtos.filter((product: Product) => product.description.toLowerCase().includes(filtroName.toLowerCase()))
                                .map((product: Product) => (
                                    <tr key={product.id} className="align-middle">
                                        <td>{product.code}</td>
                                        <td>{product.description}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.unit_price}</td>
                                        <td>{product.registration_date}</td>
                                        <td>
                                            <button className="btn btn-primary me-3" onClick={() => navigate(`/product/${product.id}`)}>Editar</button>
                                            <button className="btn btn-danger" onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Produtos;