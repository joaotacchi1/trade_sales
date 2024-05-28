import { useEffect, useState } from "react";
import { SaleProduct } from "../../types/Sales";
import api from "../../services/useApi";
import Papa from 'papaparse';

const Vendas: React.FC = () => {
    const [sales, setSale] = useState<SaleProduct[]>([]);
    const [filtroName] = useState('');

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
            if (sale.validate === "VENDIDO") {
                alert('Produto vendido');
                return;
            }
            const data = {
                id_sale: sale.id,
                id_product: sale.id_product,
            }
            const vendeu = {
                validate: "VENDIDO"
            }
            console.log(data);
            await api.put(`/sales/${id}`, vendeu);
            await api.post('/cupom/', data);
            fetchSales();
        } catch (error) {
            console.error(error);
        }
    }

    const handleExportVendas = async () => {
        const csvdata = sales.map(({ code, description, quantity, unit_price, sale_date }) => ({
            CODIGO: code,
            DESCRICAO: description,
            QUANTIDADE: quantity.toString().replace('.', ','),
            VALOR_UNITARIO: unit_price.toString().replace('.', ','),
            VALOR_TOTAL: (quantity * unit_price).toFixed(2).replace('.', ','),
            DATA_VENDA: sale_date
        }));
        
        const csv = Papa.unparse(csvdata, { delimiter: ";" });

        const csvBlob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });

		const csvURL = window.URL.createObjectURL(csvBlob);
		const tempLink = document.createElement('a');
		tempLink.href = csvURL;
		tempLink.setAttribute('download', 'relatorio.csv');
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
    }
    return (
        <div className="container">
            <div style={{ height: '600px' }}>
                <div className="h-100 overflow-y-auto border mt-3 ">
                    <table className="table table-striped table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th className="col">Codigo produto</th>
                                <th className="col">Descrição</th>
                                <th className="col">Quantidade</th>
                                <th className="col">Vl Unit</th>
                                <th className="col">Vl Total</th>
                                <th className="col">Data da venda</th>
                                <th className="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/*Filter by name, type and sector*/}
                            {sales.filter((sales: SaleProduct) => sales.description.toUpperCase().includes(filtroName.toUpperCase()))
                                .map((sales: SaleProduct) => (
                                    sales.validate !== "VENDIDO" ? (
                                    <tr key={sales.id} className="align-middle">
                                        <td>{sales.code}</td>
                                        <td>{sales.description}</td>
                                        <td>{sales.quantity}</td>
                                        <td>R$ {sales.unit_price}</td>
                                        <td>R$ {(sales.quantity * sales.unit_price).toFixed(2)}</td>
                                        <td>{sales.sale_date}</td>
                                        <td>
                                            <button className="btn btn-danger me-3" onClick={() => handleDeleteSale(sales.id)}>Excluir</button>
                                            <button className="btn btn-success" onClick={() => handleAdicionaCarrinho(sales.id)}>Carrinho</button>
                                        </td>
                                    </tr>
                                    ) : null)
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="d-flex justify-content-center my-3">
                <button className="btn btn-primary" onClick={handleExportVendas}>Exportar</button>
            </div>
        </div>
    )
}

export default Vendas;