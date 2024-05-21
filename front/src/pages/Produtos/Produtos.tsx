import { FormEvent, useEffect, useState } from "react";
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

    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [unit_price, setUnit_price] = useState(0);
    const [quantity, setQuantity] = useState(0);

    const handleCreateProduct = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                code,
                description,
                unit_price,
                quantity
            };
            await api.post('/products/', data);
            console.log(data);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="container">
                <div className="row g-3 mt-3 border rounded p-4">
                    <h1 className="text-center m-0">Cadastrar Item</h1>
                    <div className="col-sm-3">
                        <label htmlFor="name" className="form-label">Codigo</label>
                        <input type="text" className="form-control" id="name" value={code} onChange={(e) => setCode(e.target.value)} />
                    </div>
                    <div className="col-sm-3">
                        <label htmlFor="type" className="form-label">Descrição</label>
                        <input type="text" className="form-control" id="type" value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className="col-sm-3">
                        <label htmlFor="sector" className="form-label">Valor Unitário</label>
                        <input type="text" className="form-control" id="sector" value={unit_price} onChange={(e) => setUnit_price(parseInt(e.target.value))} />
                    </div>
                    <div className="col-sm-2">
                        <label htmlFor="quantity" className="form-label">Quantidade</label>
                        <input type="number" className="form-control" id="quantity" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} />
                    </div>
                    <div className="col-sm-1 align-self-end">
                        <button type="button" className="btn btn-primary" onClick={handleCreateProduct}>Cadastrar</button>
                    </div>
                </div>
            </div>
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
                            {produtos.filter((product: Product) => product.description.toUpperCase().includes(filtroName.toUpperCase()))
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