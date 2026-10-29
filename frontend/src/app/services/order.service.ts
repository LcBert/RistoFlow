import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { Order } from "../models/restaurant.models";
import { TablesService } from "./tables.service";
import { Observable, tap } from "rxjs";

export interface OpenOrderPayload {
    table: number;
    covers: number;
    status?: Order['status']
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `http://${window.location.hostname}:8000/api/orders/`;
    private readonly tablesService = inject(TablesService)

    private readonly _orders = signal<Order[]>([]);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    readonly orders = this._orders.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    loadOrders(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<Order[]>(this.apiUrl).subscribe({
            next: (data) => {
                this._orders.set(data)
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message || "Errore durante il caricamento degl'ordini");
                this._loading.set(false);
            }
        })
    }

    openNewOrder(tableNumber: number, covers: number): Observable<Order> {
        const payload: OpenOrderPayload = { table: tableNumber, covers, status: "OPEN" };
        this._loading.set(true);

        return this.http.post<Order>(this.apiUrl, payload).pipe(
            tap({
                next: (newOrder) => {
                    this._orders.update((current) => [...current, newOrder]);
                    this.tablesService.loadTables()
                    this._loading.set(false)
                },
                error: (err) => {
                    this._error.set(err.message || "Errore apertura comanda");
                    this._loading.set(false);
                }
            }))
    }
}