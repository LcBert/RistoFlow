import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Dish } from '../models/restaurant.models';

export interface CreateDishPayload {
    name: string;
    price: number;
    category: number;
    description: string;
    is_available?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class DishesService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `http://${window.location.hostname}:8000/api/dishes/`;

    // Stato reattivo centralizzato tramite Signals
    private readonly _dishes = signal<Dish[]>([]);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Esposizione in sola lettura per i componenti
    readonly dishes = this._dishes.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    loadDishes(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<Dish[]>(this.apiUrl).subscribe({
            next: (data) => {
                this._dishes.set(data);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message || 'Errore durante il caricamento dei piatti');
                this._loading.set(false);
            }
        });
    }

    getDish(id: number | string): Observable<Dish> {
        return this.http.get<Dish>(`${this.apiUrl}${id}/`);
    }

    getDishById(id: number | string): Observable<Dish> {
        return this.getDish(id);
    }

    createDish(category: number, name: string, price: number, description: string): Observable<Dish> {
        const payload: CreateDishPayload = { name, price, category, description, is_available: true };
        this._loading.set(true);
        return this.http.post<Dish>(this.apiUrl, payload).pipe(
            tap({
                next: (newDish) => {
                    this._dishes.update((current) => [...current, newDish]);
                    this._loading.set(false);
                },
                error: (err) => {
                    this._error.set(err.message || 'Errore durante la creazione del piatto');
                    this._loading.set(false);
                }
            })
        )   ;
    }

    updateAvailability(id: number, is_available: boolean): void {
        this.http.patch<Dish>(`${this.apiUrl}${id}/`, { is_available }).subscribe({
            next: (updatedDish) => {
                this._dishes.update((current) =>
                    current.map((d) => (d.id === id ? updatedDish : d))
                );
            },
            error: (err) => this._error.set(err.message || 'Errore aggiornamento disponibilità')
        });
    }

    deleteDish(id: number): void {
        this.http.delete(`${this.apiUrl}${id}/`).subscribe({
            next: () => {
                this._dishes.update((current) => current.filter((d) => d.id !== id));
            },
            error: (err) => this._error.set(err.message || 'Errore durante eliminazione del piatto')
        });
    }
}
