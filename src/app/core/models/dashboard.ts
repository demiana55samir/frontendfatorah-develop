export interface dashboard{
    clients: number,
    invoices: number,
    products: number,
    quotations: number,
    receipts: number,
    sales: number,
    receipts_amount: number,
    top_clients:top_clients[],
    top_products:top_products[]
}

export interface top_clients{
    uuid: string,
    name: string,
    address:string,
    city: string,
    client_id: string,
    user_id: number,
    email: string,
    mobile: string,
    phone: string,
    tax_number: string,
    fax:string,
    postal_code:string,
    created_at: string,
    updated_at: string,
    deleted_at: string|null,
    commercial_record_number: string,
    invoices_count: number
}
export interface top_products{
    id: number,
    uuid: string,
    name: string,
    price: number,
    type: string,
    product_id: number,
    user_id: number,
    created_at: string,
    updated_at: string,
    deleted_at: string|null,
    sales: number
}
export interface topCards{
    clients: number,
    invoices: number,
    products: number,
    quotations: number,
    receipts: number,
    sales: number,
}