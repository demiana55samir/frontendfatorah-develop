import { features } from "./landing"

export interface subscription_plans{
    id:number
    name:string
    description:string
    price:number
    yearly_price:number
    features:features[]
    currency:string,
    yearly_full_price:number,
    monthly_full_price:number
    durations:duration,
    trial_period?:number,
    full_price?:number,
    plan_duration:number
}
export interface duration{
    id: number,
    name: string,
    full_price: number,
    price: number,
    plan_duration_id: number,
    slug:string
}

export interface durations_details{
    id: number,
    name: string,
    slug: string,
    sort_order: number,
    created_at: string,
    updated_at: string,
    deleted_at: string
}
export interface plan_details{
        id: number,
        slug: string,
        name:string,
        name_ar:string,
        name_en:string,
        description:string,
        description_ar:string,
        description_en:string,
        is_active: boolean,
        durations: durations_details,
        price: number,
        full_price: number,
        signup_fee: number,
        currency: string ,
        currency_code: string,
        features:features[]
        trial_period: number,
        trial_interval: string,
        invoice_period: number,
        invoice_interval: string,
        grace_period: number,
        grace_interval: string,
        prorate_day: number,
        prorate_period: number,
        prorate_extend_due: number,
        active_subscribers_limit: number,
        sort_order: number,
        created_at: string
 
}