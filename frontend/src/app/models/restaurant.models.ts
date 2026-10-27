export interface RestaurantSettings {
    name: string;
}

export interface Table {
    number: number;
    seats: number;
    status: "FREE" | "OCCUPIED" | "RESERVED";
    status_display: string;
}

export interface Dish {
    id: number;
    name: string;
    price: number;
    is_available: boolean;
    category: number;
}

export interface OrderItem {
    id: number;
    dish: number;
    dish_name: string;
    quantity: number;
    unit_price: string;
    notes: string;
    subtotal: string;
}

export interface Order {
    id: number;
    table: number;
    status: 'OPEN' | 'BILLED' | 'CLOSED' | 'CANCELLED';
    status_display: string;
    covers: number;
    opened_at: string;
    total_price: string;
    items: OrderItem[];
}
