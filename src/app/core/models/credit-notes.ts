import { bank } from "./bank"
import { product } from "./product"

export interface creditNotes{
client: string
client_id: string
id: number
invoice_id: string
number: number
status: string
total: string
user: string
user_id: number
uuid: string
with_tax: number

currency: string,

client_address: string,
client_tax_number:string,
client_phone: string,
invoice_number: number,
issue_date: string,
due_date: string,

cancellation_reason: string,

notes: string,
created_at: string,
products:product[]
invoice_color: string,
logo: string,
tax_number: string,
credit_note_title: string,
account_name: string,
address:string,
city: string,
telephone: string,
template_slug: string,
user_currency:string,
bank_accounts:bank[],

zatca_send_status?:number,
zatca_warnings?:string[],
zatca_errors?:string[],
eligible_sending_zatca?:boolean,
tax_exemption_code:string,
tax_exemption_reason:string,
zatca_stage:string,
zatca_check_parent_invoice:boolean

}