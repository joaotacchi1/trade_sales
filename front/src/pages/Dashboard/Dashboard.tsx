import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../../services/useApi';
import { Sale } from '../../types/Sales';

interface SaleTotal {
    sale_date: string;
    total: number;
}

interface MonthlyTotal {
    month: string;
    total: number;
}

const Dashboard = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [salesTotal, setSalesTotal] = useState<SaleTotal[]>([]);
    const [monthlyTotal, setMonthlyTotal] = useState<MonthlyTotal[]>([]);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await api.get('/sales');
                const data = res.data;
                setSales(data);
            } catch (error) {
                console.error('Erro ao buscar vendas:', error);
            }
        };
        fetchSales();
    }, []);

    useEffect(() => {
        const calculateTotalByDate = () => {
            const totalByDate = sales.reduce((acc, sale) => {
                const date = sale.sale_date;
                const total = sale.quantity * sale.unit_price;
                if (!acc[date]) {
                    acc[date] = 0;
                }
                acc[date] += total;
                return acc;
            }, {} as Record<string, number>);

            const salesTotalArray = Object.entries(totalByDate).map(([sale_date, total]) => ({
                sale_date,
                total
            }));
            setSalesTotal(salesTotalArray);
        };

        calculateTotalByDate();
    }, [sales]);

    useEffect(() => {
        const calculateMonthlyTotal = () => {
            const totalByMonth = salesTotal.reduce((acc, sale) => {
                const date = new Date(sale.sale_date);
                const month = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
                if (!acc[month]) {
                    acc[month] = 0;
                }
                acc[month] += sale.total;
                return acc;
            }, {} as Record<string, number>);

            const monthlyTotalArray = Object.entries(totalByMonth).map(([month, total]) => ({
                month,
                total
            }));
            setMonthlyTotal(monthlyTotalArray);
        };

        calculateMonthlyTotal();
    }, [salesTotal]);

    return (
        <div style={{ padding: '2rem', textAlign: 'center', justifyItems: 'center' }}>
            <h1>Dashboard de Vendas</h1>
            <BarChart width={1200} height={400} data={salesTotal} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sale_date" />
                <YAxis tickFormatter={(value) => `R$ ${value}`} />
                <Tooltip formatter={(value) => `R$ ${value}`} />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total de Vendas" />
            </BarChart>
            <h2>Valor Total de Vendas: R$ {salesTotal.reduce((acc, sale) => acc + sale.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
            <h3>Acumulado de Vendas por Mês</h3>
            <table style={{ margin: '0 auto', borderCollapse: 'collapse', width: '80%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Mês</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {monthlyTotal.map((item) => (
                        <tr key={item.month}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{item.month}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard; 