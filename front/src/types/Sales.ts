export type Sale = {
    id: number;
    quantity: number;
    sale_date: string;
};

export type SaleProduct = {
    id: number;
    id_product: number;
    code: number;
    quantity: number;
    sale_date: string;
    description: string;
    unit_price: number;
};