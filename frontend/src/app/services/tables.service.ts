import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Table } from '../models/restaurant.models';

export interface CreateTablePayload {
    number: number;
    seats: number;
    status?: Table['status'];
}

@Injectable({
    providedIn: 'root'
})
export class TablesService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8000/api/tables/';

    // Stato reattivo centralizzato tramite Signals
    private readonly _tables = signal<Table[]>([]);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Esposizione in sola lettura per i componenti
    readonly tables = this._tables.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    loadTables(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<Table[]>(this.apiUrl).subscribe({
            next: (data) => {
                this._tables.set(data);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message || 'Errore durante il caricamento dei tavoli');
                this._loading.set(false);
            }
        });
    }

    getTableById(id: number | string): Observable<Table> {
        return this.http.get<Table>(`${this.apiUrl}${id}/`);
    }

    createTable(payload: CreateTablePayload): void {
        this._loading.set(true);
        this.http.post<Table>(this.apiUrl, payload).subscribe({
            next: (newTable) => {
                // Aggiorna lo stato locale senza dover ricaricare l'intera lista
                this._tables.update((current) => [...current, newTable]);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message || 'Errore durante la creazione del tavolo');
                this._loading.set(false);
            }
        });
    }

    updateStatus(id: number, status: Table['status']): void {
        this.http.patch<Table>(`${this.apiUrl}${id}/`, { status }).subscribe({
            next: (updatedTable) => {
                this._tables.update((current) =>
                    current.map((t) => (t.id === id ? updatedTable : t))
                );
            },
            error: (err) => this._error.set(err.message || 'Errore aggiornamento stato')
        });
    }
}
