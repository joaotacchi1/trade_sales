import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import api from "../../services/useApi";

const VendeProdutos = () => {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [filtroName, setFiltroName] = useState('');
    const [saleQuantities, setSaleQuantities] = useState<{ [key: number]: number }>({});
    
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

    const handleSaleQuantityChange = (id: number, value: number) => {
        setSaleQuantities((prevQuantities) => ({
            ...prevQuantities,
            [id]: value,
        }));
    };

    const handleSellProduct = async (id: number) => {
        console.log(id);
        try {
            const res = await api.get(`/products/${id}`);
            const product = res.data;
            if (product.quantity < (saleQuantities[id] || 0)) {
                alert('Quantidade insuficiente');
                return;
            }
            const data = {
                id_product: product.id,
                quantity: saleQuantities[id] || 0, // Use the specific sale_quantity for this product
            };
            console.log(data);
            await api.post('/sales/', data);
            fetchProducts();
            handleSaleQuantityChange(id, 0);
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <div className="container">
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
                                            <button className="btn btn-success" onClick={() => handleSellProduct(product.id)}>Vender</button>
                                            <input
                                                type="number"
                                                className="form-control"
                                                id={`quantity-${product.id}`}
                                                value={saleQuantities[product.id] || 0}
                                                onChange={(e) => handleSaleQuantityChange(product.id, parseFloat(e.target.value))}
                                            />
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

export default VendeProdutos;