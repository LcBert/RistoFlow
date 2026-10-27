import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dish, Order, Table } from '../models/restaurant.models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:8000/api';

    login(credentials: { username: string; password: string }): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`${this.apiUrl}/auth/token/`, credentials);
    }

    getTables(): Observable<Table[]> {
        return this.http.get<Table[]>(`${this.apiUrl}/tables/`);
    }

    updateTableStatus(id: number, status: Table['status']): Observable<Table> {
        return this.http.patch<Table>(`${this.apiUrl}/tables/${id}/`, { status });
    }

    getDishes(): Observable<Dish[]> {
        return this.http.get<Dish[]>(`${this.apiUrl}/dishes/`);
    }

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(`${this.apiUrl}/orders/`);
    }

    createOrder(order: Partial<Order>): Observable<Order> {
        return this.http.post<Order>(`${this.apiUrl}/orders/`, order);
    }
}