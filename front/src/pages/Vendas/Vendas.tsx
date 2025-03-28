import { useEffect, useState } from "react";
import { SaleProduct } from "../../types/Sales";
import api from "../../services/useApi";
import Papa from 'papaparse';

const Vendas: React.FC = () => {
    const [sales, setSale] = useState<SaleProduct[]>([]);
    const [filtroName] = useState('');
    const [valorTotal, setValorTotal] = useState(0);
    const user = localStorage.getItem('name');

    useEffect(() => {
        fetchSales();
    }, []);

    useEffect(() => {
        calculaValorTotal();
    }, [sales]);

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

    const handleFechamento = async () => {
        // Obtém a data de hoje no formato 'YYYY-MM-DD'
        const today = new Date();
        const dataHoje = new Date().toISOString().split('T')[0];
        let total = 0;

        // Cria a estrutura HTML com os dados
        let htmlContent = ` <div>
                                <p>.</p>
                                <p>FECHAMENTO CAIXA TROCA ${today.toLocaleDateString()}</p>
                                <p>USUARIO: ${user?.toUpperCase()}</p>
                            </div>`
        htmlContent += '<table>';

        sales.filter(sale => sale.sale_date === dataHoje)
            .forEach((sale, index) => {
                total += sale.unit_price * sale.quantity;
                htmlContent += `
                <tr>
                    <td>${sale.description}</td>
                </tr>
                <tr>
                    <td>${sale.quantity.toString().replace('.', ',')}..........................</td>
                    <td>R$ ${sale.unit_price.toFixed(2).toString().replace('.', ',')}</td>
                </tr>
                <tr>

                </tr>
            `;
            });

        htmlContent += `<tr>
                            <td style="padding: 0">___________________________________</td></tr>
                            <tr><td>VALOR TOTAL................</td><td>R$ ${total.toFixed(2).toString().replace('.', ',')}</td>
                        </tr>`
        htmlContent += '</table>';

        let printWindow = window.open('', '_blank');

        if (printWindow) {
            printWindow.document.write('<html><head><title>.</title></head><body>');
            printWindow.document.write(htmlContent);
            printWindow.document.write('<footer>.</footer></body></html>');
            printWindow.onload = function () {
                printWindow.print();
                printWindow.close();
            };
            printWindow.document.close();

        }

    }

    const calculaValorTotal = () => {
        let total = 0;
        sales.filter((sales: SaleProduct) => sales.validate !== "VENDIDO").map((sale: SaleProduct) => {
            total += sale.unit_price * sale.quantity;
        });
        setValorTotal(total);
    }

    const handleExportVendaHoje = async () => {
        // Obtém a data de hoje no formato 'YYYY-MM-DD'
        const today = new Date().toISOString().split('T')[0];


        // Filtra as vendas pela data de hoje
        const csvdata = sales
            .filter(sale => sale.sale_date === today)
            .map(({ code, description, quantity, unit_price, sale_date }) => ({
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
            <h2 className="text-center">Carrinho</h2>
            <div style={{ height: '500px' }}>
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
                                                <button className="btn btn-success" onClick={() => handleAdicionaCarrinho(sales.id)}>Cupom</button>
                                            </td>
                                        </tr>
                                    ) : null)
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h3 className="text-center">Valor Total: R$ {valorTotal.toFixed(2)}</h3>
            </div>
            <div className="d-flex justify-content-center my-3">
                <button className="btn btn-primary me-3" onClick={handleExportVendas}>Exportar</button>
                <button className="btn btn-primary me-3" onClick={handleExportVendaHoje}>baixar vendas de hoje</button>
                <button className="btn btn-primary" onClick={handleFechamento}>Fechamento</button>
            </div>
        </div>
    )
}

export default Vendas;