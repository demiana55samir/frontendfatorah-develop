import { bank } from "./bank";
import { product } from "./product";


export interface quotations{
    id: number,
    uuid:string,
    user_id: number,
    number: string,
    user: string,
    account_name: string,
    tax_number: string,
    address:string|null,
    city: string,
    telephone: string,
    user_currency: string,
    client_id:number,
    client: string,
    client_address: string|null,
    client_city: string|null,
    client_tax_number:string,
    client_phone: string,
    status: string,
    issue_date: string,
    total: string,
    notes: string,
    cancellation_reason: string,
    created_at: string,
    products: product[],
    invoice_color: string,
    logo:string,
    signature: string,
    template_slug: string,
    bank_accounts:bank[],
    showFilgrane: boolean,
    invoices_count: number
}