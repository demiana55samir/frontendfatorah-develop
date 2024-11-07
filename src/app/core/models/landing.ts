export interface cardData{
    titleAR:string,
    titleEN:string,
    bodyAR:string,
    bodyEN:string,
    image:string,
    icon?:string
    }
 export interface cardData1{
    number:number,
    bodyEN:string,
    bodyAR:string,
    image:string
    }
  
export interface features{
    id: number,
    plan_id: number,
    slug: string,
    name: string,
    description: string,
    value: string,
    resettable_period: number,
    resettable_interval: string,
    sort_order: number,
    created_at: string,
    updated_at: string,
    deleted_at: string
}
