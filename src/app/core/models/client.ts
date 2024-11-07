export interface client{
    client_id:number
    name:string
    uuid: string,
    address: string,
    city:string,
    user_id: number,
    email: string|null,
    mobile: string|null,
    phone: string|null,
    tax_number: string|null,
    receipts_count:number
    quotations_count:number
    fax: string|null,
    postal_code: string|null,
    created_at: string,
    updated_at: string,
    deleted_at: string,
    commercial_record_number: string,
    invoices_count: number,
    paid: number|null,
    total: number
    unpaid:number
}