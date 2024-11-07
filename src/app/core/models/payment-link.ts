export interface paymentLinks{
    id: number,
    uuid: string,
    invoice_uuid: string,
    inoice_number: number,
    user_uuid: string,
    user: string,
    payment_for: string,
    email: string,
    invoice_amount: number,
    amount: number,
    paid_amount: number,
    received_amount: number,
    state:string,
    generated_at: string,
    active_until: string,
    expired:boolean
}