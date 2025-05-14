import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import api from '../../services/useApi';
import { SaleProduct } from '../../types/Sales';

interface SaleTotal {
    sale_date: string;
    total: number;
}

const Dashboard = () => {
    const [sales, setSales] = useState<SaleProduct[]>([]);
    const [salesTotal, setSalesTotal] = useState<SaleTotal[]>([]);

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
        </div>
    );
};

export default Dashboard; 