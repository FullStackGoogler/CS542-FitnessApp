export interface SupplementItem {
    supplementid: number;
    product_name: string;
    product_category: string;
    product_description: string;
    brand_name: string;
    link:string;
    price:number;
    price_per_serving:number;
    overall_rating:number;
    number_of_reviews: number;
    verified_buyer_rating: number;
    verified_buyer_number: number;
    top_flavor_rated: string;
    number_of_flavors: number;
    average_flavor_rating: number;
}