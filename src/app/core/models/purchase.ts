export interface purchase{
    uuid: string,
    number: number,
    date: string,
    purchase_date?: string,
    code_number: string,
    notes: string,
    currency:string,
    recipient: string,
    payment_method: string,
    image: string ,
    total?:number,
    supplier_name?:string 
    supplier_id?:number 
    expenses_types:expense
    status?:number,
    status_title?:string
    is_imported?:number
    has_taxable_inoivce?:number,
    conversion_rate?:number,
    converted_amount?:number,
    tax_amount?:number,
    tax_rate?:number,
    tax_after_tax?:number,
    payments?:payment[],
    currency_is_sar:number,
    remaining_amount?:number,
    unpaid_converted?:number,
    tax_exemption_reason?:string
    
}

export interface payment{
    name:{
      ar:string,
      en:string
     },
     paid_amount:number,
     converted_amount:number,
  }
export interface expense{
    id: number,
    name: string,
    type: 'expense' | 'purchase',
    taxable: number,
    active: number,
    created_at: string,
    updated_at: string,
    deleted_at: string
}