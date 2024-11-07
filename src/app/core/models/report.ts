export interface salesReport{
    
        issue_date: string,
        invoice_number: number,
        client: string,
        description: string,
        tax_number: string,
        tax_percentage: string,
        taxable_amount: string,
        tax_value: number,
        total: number,
        month: number
    
}

export interface earningsReport{
    
     opening_balance: number,
     expenses: number,
     sales: number,
     total_taxes: number,
     total_revenue: number,
}



export interface monthlyplan{
name: string,
count: number
}
export interface monthly_data{
profits: number,
subscription_count: number,
subscriptions: monthlyplan[],
renew_subscriptions_count: number,
renew_subscriptions: monthlyplan[],
new_subscriptions_count: number,
new_subscriptions:monthlyplan[]
}


export interface taxReport{
        total: number,
        total_tax: number,
        total_without_tax:number
}