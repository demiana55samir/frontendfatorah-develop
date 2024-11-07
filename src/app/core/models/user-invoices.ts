import { creditNotes } from "./credit-notes"
import { product } from "./product"

export interface userInvoice{
    id: number,
    uuid:string,
    user_id: number,
    user:string,
    client_id: string,
    quotation_id: number|null,
    number: number,
    currency:string,
    client: string,
    client_address: string|null,
    client_postal_code: string|null,
    client_tax_number: string,
    client_phone: string|null,
    client_email:string|null
    date: string,
    invoice_due: string,
    total: number,
    status:string,
    cancellation_reason:string| null,
    with_tax: number,
    notes:string,
    created_at:string,
    service_id: number|null,
    paid: number,
    products:any[],
    
    invoice_color: string,
    template_slug: string,
    receipts: [],
    logo: string|null,
    account_name: string,
    name: string,
    tax_number: string,
    invoice_title: string,
    address: string|null,
    city: string,
    telephone: string,
    user_currency: string,
    bank_accounts: bank_accounts[]
    // unpaid_count:number,
    unpaid:number,
    paid_count:number,
    credit_notes:creditNotes[],
    user_fax:string,
    qr_code:string,
    total_discounts:number,
    zatca_send_status?:number,
    zatca_warnings?:string[],
    zatca_errors?:string[],
    eligible_sending_zatca?:boolean,
    tax_exemption_code:string,
    tax_exemption_reason:string,
    zatca_stage:string,
    can_create_credit_note:boolean
}

export interface bank_accounts{
    created_at:string
    deleted_at:string
    full_name:string
    id:number
    name:string
    number:string
    updated_at:string
    user_id:number
    uuid:string
}

