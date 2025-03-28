export type Sale = {
    id: number;
    quantity: number;
    unit_price: number;
    code: number;
    description: string;
    validate: string;
    product_code: number;
    sale_date: string;
    user: string;
};

export type SaleProduct = {
    id: number;
    id_product: number;
    code: number;
    quantity: number;
    sale_date: string;
    description: string;
    unit_price: number;
    validate: string;
    user: string;
};