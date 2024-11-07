import { userInvoice } from "./user-invoices";

export interface product{
      id: number,
      total_invoices: number,
      quotations: number,
      sales: number,
      invoices: userInvoice[]
      pivot:pivot
      uuid: string,
      name: string,
      type: string,
      product_id: number,
      user_id: number,
      quantity: number,
      tax:number,
      discount: number,
      price: number,
      total: number,
      created_at: string
      taxable_amount?: string,
      tax_value?: number,

      discount_type ?: number,
      discount_value ?:number,
      max_qty ?:number,





}

export interface addedProduct{
        product_id:string|null,
        quantity:number|null,
        max_qty?:number|null,
        price:number|null,
        discount:number|null,
        tax:number|null,
        discount_type ?: number| null,
        discount_value ?:number | null
}

export interface addedProductWithTotal{
      product_id:string|null,
      quantity:number|null,
      price:number|null,
      discount:number|null,
      tax:number|null,
      total:number|null,
      totalwithoutTax:number|null
}

export interface pivot{
      quantity:number
      discount:number
      price:number
      total:number
      tax:number,
      discount_type ?: number,
      discount_value ?:number
}
