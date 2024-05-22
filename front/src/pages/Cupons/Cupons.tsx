import { useEffect, useState } from "react";
import { Cupom } from "../../types/cupom";
import api from "../../services/useApi";

const Cupons: React.FC = () => {
    const [cupons , setCupons] = useState<Cupom[]>([]);

    useEffect(() => {
        fetchCupons();
    }, []);

    const fetchCupons = async () => {
        try {
            const res = await api.get('/cupom/');
            setCupons(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteCupom = async (id: number) => {
        try {
            await api.delete(`/cupom/${id}`);
            fetchCupons();
        } catch (error) {
            console.error(error);
        }
    }

    const handleImprimeCupom = async () => {
        console.log('imprimir cupom 2x')
    }

    const handleLimpaCarrinho = async () => {
        try {
            await api.delete('/cupom/');
            fetchCupons();
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
                                        <td>{cupom.unit_price}</td>
                                        <td>{cupom.unit_price * cupom.quantity}</td>
                                        <td>{cupom.impression_date}</td>
                                        <td><button type="button" className="btn btn-danger" onClick={() => handleDeleteCupom(cupom.id)}>Deletar</button>
                                        </td>
                            
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <button type="button" className="btn btn-success" onClick={() => handleImprimeCupom()}>Imprimir Cupom</button>
                <button type="button" className="btn btn-danger" onClick={() => handleLimpaCarrinho()}>Limpar Carrinho</button>
            </div>
        </div>
    )
}

export default Cupons;