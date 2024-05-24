import { FormEvent, useEffect, useState } from "react";
import { Product } from "../../types/Product";
import api from "../../services/useApi";

const Produtos: React.FC = () => {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [filtroName, setFiltroName] = useState('');

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
    };

    const handleFilterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroName(event.target.value);
    };

    const handleDeleteProduct = async (id: number) => {
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [unit_price, setUnit_price] = useState(0.0);
    const [quantity, setQuantity] = useState(0);
    const [obs, setObs] = useState('');

    const handleCreateProduct = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const data = {
                code,
                description,
                unit_price,
                quantity,
                obs
            };
            await api.post('/products/', data);
            console.log(data);
            fetchProducts();
        } catch (error) {
            console.error(error);
        }
    };

    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const handleEditProduct = (product: Product) => {
        setCurrentProduct(product);
        setCode(product.code.toString()); // Convert product.code to a string
        setDescription(product.description);
        setUnit_price(product.unit_price);
        setQuantity(product.quantity);
        setObs(product.obs);
    };

    const clearProduct = () => {
        setCurrentProduct(null);
        setCode('');
        setDescription('');
        setUnit_price(0.0);
        setQuantity(0);
        setObs('');
    }

    const handleUpdateProduct = async () => {
        if (!currentProduct) return;
        try {
            const updatedProduct = {
                code,
                description,
                unit_price,
                quantity,
                obs
            };
            await api.put(`/products/${currentProduct.id}`, updatedProduct);
            fetchProducts();
            clearProduct();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="container">
            <div className="row g-3 mt-3 border rounded p-4 m-0">
                <h1 className="text-center m-0">Cadastrar Item</h1>
                <div className="col-sm-2">
                    <label htmlFor="name" className="form-label">Codigo</label>
                    <input type="text" className="form-control" id="name" value={code} onChange={(e) => setCode(e.target.value)} />
                </div>
                <div className="col-sm-3">
                    <label htmlFor="type" className="form-label">Descrição</label>
                    <input type="text" className="form-control" id="type" value={description} onChange={(e) => setDescription(e.target.value.toUpperCase())} />
                </div>
                <div className="col-sm-1">
                    <label htmlFor="quantity" className="form-label">Quantidade</label>
                    <input type="number" className="form-control" id="quantity" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} />
                </div>
                <div className="col-sm-2">
                    <label htmlFor="sector" className="form-label">Valor Unitário</label>
                    <input type="number" className="form-control" id="sector" value={unit_price} onChange={(e) => setUnit_price(parseFloat(e.target.value))} />
                </div>
                <div className="col-sm-3">
                    <label htmlFor="type" className="form-label">Observação</label>
                    <input type="text" className="form-control" id="type" value={obs} onChange={(e) => setObs(e.target.value.toUpperCase())} />
                </div>
                <div className="col-sm-1 align-self-end">
                    <button type="button" className="btn btn-primary" onClick={handleCreateProduct}>Cadastrar</button>
                </div>
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">Atualizar Produto</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="col">
                                <label htmlFor="editCode" className="form-label">Codigo</label>
                                <input type="text" className="form-control" id="editCode" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
                            </div>
                            <div className="col">
                                <label htmlFor="editDescription" className="form-label">Descrição</label>
                                <input type="text" className="form-control" id="editDescription" value={description} onChange={(e) => setDescription(e.target.value.toUpperCase())} />
                            </div>
                            <div className="col">
                                <label htmlFor="editQuantity" className="form-label">Quantidade</label>
                                <input type="number" className="form-control" id="editQuantity" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value))} />
                            </div>
                            <div className="col">
                                <label htmlFor="editUnitPrice" className="form-label">Valor Unitário</label>
                                <input type="number" className="form-control" id="editUnitPrice" value={unit_price} onChange={(e) => setUnit_price(parseFloat(e.target.value))} />
                            </div>
                            <div className="col">
                                <label htmlFor="editObs" className="form-label">Observação</label>
                                <input type="text" className="form-control" id="editObs" value={obs} onChange={(e) => setObs(e.target.value.toUpperCase())} />
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={handleUpdateProduct} data-bs-dismiss="modal">Atualizar</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <input type="text" className="form-control col my-3" placeholder="Filtrar por nome" onChange={handleFilterNameChange} />
            </div>
            <div style={{ height: '600px' }}>
                <div className="h-100 overflow-y-auto border">
                    <table className="table table-striped table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th className="col">Code</th>
                                <th className="col">Descrição</th>
                                <th className="col">Quantidade</th>
                                <th className="col">Vl Unit</th>
                                <th className="col">Observação</th>
                                <th className="col">Cadastro</th>
                                <th className="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.filter((product: Product) => product.description.toUpperCase().includes(filtroName.toUpperCase()))
                                .map((product: Product) => (
                                    <tr key={product.id} className="align-middle">
                                        <td>{product.code}</td>
                                        <td>{product.description}</td>
                                        <td>{product.quantity}</td>
                                        <td>R$ {product.unit_price}</td>
                                        <td>{product.obs}</td>
                                        <td>{product.registration_date}</td>
                                        <td>
                                            <button className="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => handleEditProduct(product)}>Editar</button>
                                            <button className="btn btn-danger me-3" onClick={() => handleDeleteProduct(product.id)}>Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Produtos;
