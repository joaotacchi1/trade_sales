import { useEffect, useState } from "react";
import { Sale, SaleProduct } from "../../types/Sales";
import api from "../../services/useApi";
import { useNavigate } from "react-router-dom";

const Vendas: React.FC = () => {
    const [sales, setSale] = useState<SaleProduct[]>([]);
    const [filtroName, setFiltroName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSales();
    }, []);

    const fetchSales = async () => {
        try {
            const res = await api.get('/sales/');
            setSale(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteSale = async (id: number) => {
        try {
            await api.delete(`/sales/${id}`);
            fetchSales();
        } catch (error) {
            console.error(error);
        }
    }

    const handleAdicionaCarrinho = async (id: number) => {
        console.log(id);
        try {
            const res = await api.get(`/getsales/${id}`);
            const sale = res.data;
            const data = {
                id_sale: sale.id,
                id_product: sale.id_product,
            }
            console.log(data);
            await api.post('/cupom/', data);
            
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="container">
            <div style={{ height: '600px' }}>
                <div className="h-100 overflow-y-auto border ">
                    <table className="table table-striped table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th className="col">Codigo produto</th>
                                <th className="col">Descrição</th>
                                <th className="col">Quantidade</th>
                                <th className="col">Vl Unit</th>
                                <th className="col">Data da venda</th>
                                <th className="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*Filter by name, type and sector*/}
                            {sales.filter((sales: SaleProduct) => sales.description.toUpperCase().includes(filtroName.toUpperCase()))
                                .map((sales: SaleProduct) => (
                                    <tr key={sales.id} className="align-middle">
                                        <td>{sales.code}</td>
                                        <td>{sales.description}</td>
                                        <td>{sales.quantity}</td>
                                        <td>{sales.unit_price}</td>
                                        <td>{sales.sale_date}</td>
                                        <td>
                                            <button className="btn btn-danger me-3" onClick={() => handleDeleteSale(sales.id)}>Excluir</button>
                                            <button className="btn btn-success" onClick={() => handleAdicionaCarrinho(sales.id)}>Carrinho</button>
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

export default Vendas;