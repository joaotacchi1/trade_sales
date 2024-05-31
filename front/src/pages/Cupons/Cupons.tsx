import { useEffect, useState } from "react";
import { Cupom } from "../../types/cupom";
import api from "../../services/useApi";

const Cupons: React.FC = () => {
    const [cupons, setCupons] = useState<Cupom[]>([]);
    const [valorTotal, setValorTotal] = useState(0);

    useEffect(() => {
        fetchCupons();
    }, []);

    useEffect(() => {
        calculaValorTotal();
    }, [cupons]);

    const fetchCupons = async () => {
        try {
            const res = await api.get('/cupom/');
            setCupons(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const calculaValorTotal = () => {
        let total = 0;
        cupons.map((cupom: Cupom) => {
            total += cupom.unit_price * cupom.quantity;
        });
        setValorTotal(total);
    }

    const handleDeleteCupom = async (id: number) => {
        try {
            const vendeu = {
                validate: "null"
            }
            cupons.map((cupom: Cupom) => {
                if (cupom.id === id) {
                    api.put(`/sales/${cupom.id_sale}`, vendeu);
                }
            });
            await api.delete(`/cupom/${id}`);
            fetchCupons();
        } catch (error) {
            console.error(error);
        }
    }

    const handleLimpaCarrinho = async () => {
        try {
            await api.delete('/cupom/');
            fetchCupons();
            calculaValorTotal();
        } catch (error) {
            console.error(error);
        }
    }

    const handleImprimeCupom = async () => {
        // Cria a estrutura HTML com os dados
        let htmlContent = ` <div>
                                <h3>COMPROVANTE DE VENDA</h3>
                                <p>CUPOM VALIDO POR 3 DIAS</p>
                                <p>PASSADO O PRAZO, O CUPOM</p>
                                <p>PERDE A VALIDADE</p>
                            </div>`
        htmlContent += '<table>';

        cupons.forEach((cupom, index) => {
            htmlContent += `
                <tr>
                    <td>${cupom.description}</td>
                </tr>
                <tr>
                    <td>${cupom.quantity.toString().replace('.', ',')}</td>
                    <td>R$ ${cupom.unit_price.toString().replace('.', ',')}</td>
                </tr>
                <tr>
                    <td style="padding: 0">....................................</td>
                    <td style="padding: 0">..............</td>
                </tr>
            `;
        });

        htmlContent += `<tr><td>Valor Total</td><td>R$ ${valorTotal.toFixed(2).toString().replace('.', ',')}</td></tr>`
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
            /*printWindow.document.close();*/
            
        }

        // Espera a nova janela carregar e então chama a função de impressão

    };


    return (
        <div className="container">
            <div style={{ height: '600px' }}>
                <div className="h-100 overflow-y-auto border mt-3">
                    <table className="table table-striped table-bordered table-hover m-0">
                        <thead>
                            <tr>
                                <th className="col">Descrição</th>
                                <th className="col">Quantidade</th>
                                <th className="col">Vl Unit</th>
                                <th className="col">Vl Total</th>
                                <th className="col">Data de Impressão</th>
                                <th className="col">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cupons.map((cupom: Cupom) => (
                                <tr key={cupom.id} className="align-middle">
                                    <td>{cupom.description}</td>
                                    <td>{cupom.quantity}</td>
                                    <td>R$ {cupom.unit_price}</td>
                                    <td>R$ {(cupom.unit_price * cupom.quantity).toFixed(2)}</td>
                                    <td>{cupom.impression_date}</td>
                                    <td><button type="button" className="btn btn-danger" onClick={() => handleDeleteCupom(cupom.id)}>Deletar</button>
                                    </td>
                                </tr>

                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="text-center">
                <button type="button" className="btn btn-success m-3" onClick={() => handleImprimeCupom()}>Imprimir Cupom</button>
                <button type="button" className="btn btn-danger" onClick={() => handleLimpaCarrinho()}>Limpar Carrinho</button>
            </div>
            <div>
                <h3 className="text-center">Valor Total: R$ {valorTotal.toFixed(2)}</h3>
            </div>
        </div>
    )
}

export default Cupons;