export interface activity{
    id: number,
    name: string,
    name_en: string,
    name_ar: string,
    slug: string,
    is_enable: number,
    sort_order: number,
    created_at: string
}
export interface city{
    id: number,
    name: string,
    name_en: string,
    name_ar: string,
    slug: string,
    is_enable: number,
    sort_order: number,
    created_at: string,
    updated_at: string
}

export interface entity{
    id: number,
    name: string,
    name_en: string,
    name_ar: string,
    slug: string,
    is_enable: number,
    sort_order: number,
    created_at: string,
    updated_at: string
}
export interface category{
    id: number,
    name: string,
    name_en: string,
    name_ar: string,
    type: string,
    taxable: number,
    active: number,
    created_at: string,
    updated_at: string
}
export interface duration{
    id: number,
    name: string,
    name_en: string,
    name_ar: string,
    slug: string,
    created_at: string
}
