import { useEffect, useState } from "react";
import { Product } from "../../types/Product";
import api from "../../services/useApi";

const VendeProdutos = () => {
    const [produtos, setProdutos] = useState<Product[]>([]);
    const [filtroName, setFiltroName] = useState('');
    const [filtroEAN, setFiltroEAN] = useState('');
    const [saleQuantities, setSaleQuantities] = useState<{ [key: number]: number }>({});
    const user = localStorage.getItem('name');

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
                unit_price: product.unit_price,
                quantity: saleQuantities[id] || 0, // Use the specific sale_quantity for this product
                code: product.code,
                description: product.description,
                validate: product.validate,
                product_code: product.code,
                user: user
            };
            console.log(data);
            await api.post('/sales/', data);
            fetchProducts();
            handleSaleQuantityChange(id, 0);
            setFiltroName('');
            setFiltroEAN('');
        } catch (error) {
            console.error(error);
        }
    };
    const handleFilterNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroName(event.target.value);
    };
    const handleFilterCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFiltroEAN(event.target.value);
    }
    const formattedPrice = (price: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    }
    return (
        <div className="container">
            <div className="my-3">
                <input type="text" className="form-control col mb-2" placeholder="Filtrar por nome" onChange={handleFilterNameChange} value={filtroName}/>
                <input type="text" className="form-control col" placeholder="Filtrar por EAN" onChange={handleFilterCodeChange} value={filtroEAN}/>
            </div>
            <div style={{ height: '500px' }} className="mb-3">
                <div className="h-100 overflow-y-auto border">
                    <table className="table table-striped table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th className="col">EAN</th>
                                <th className="col">Descrição</th>
                                <th className="col">Quantidade</th>
                                <th className="col">Vl Unit</th>
                                <th className="col">Observação</th>
                                <th className="col">Cadastro</th>
                                <th className="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos
                                .filter((product: Product) =>
                                    product.description.toUpperCase().includes(filtroName.toUpperCase())
                                    && product.ean.toString().includes(filtroEAN.toString())
                                    && product.quantity > 0
                                )
                                .sort((a: Product, b: Product) => 
                                    a.description.localeCompare(b.description)
                                )
                                .map((product: Product) => (
                                    <tr key={product.id} className="align-middle">
                                        <td>{product.ean}</td>
                                        <td>{product.description}</td>
                                        <td>{product.quantity}</td>
                                        <td>{formattedPrice(product.unit_price)}</td>
                                        <td>{product.obs}</td>
                                        <td>{product.registration_date}</td>
                                        <td className="d-flex">
                                            <input
                                                type="number"
                                                className="form-control me-3"
                                                style={{ width: '100px' }}
                                                id={`quantity-${product.id}`}
                                                value={saleQuantities[product.id] || 0}
                                                onChange={(e) => handleSaleQuantityChange(product.id, parseFloat(e.target.value))}
                                            />
                                            <button className="btn btn-success" onClick={() => handleSellProduct(product.id)}>Vender</button>

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