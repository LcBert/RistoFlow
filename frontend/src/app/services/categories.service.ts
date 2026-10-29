import { HttpClient } from "@angular/common/http"
import { inject, Injectable, signal } from "@angular/core"
import { Category } from "../models/restaurant.models";

export interface CreateCategoryPayload {
    name: string
    description: string
}

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `http://${window.location.hostname}:8000/api/categories/`;

    // Stato reattivo centralizzato tramite Signals
    private readonly _categories = signal<Category[]>([]);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    // Esposizione in sola lettura per i componenti
    readonly categories = this._categories.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    loadCategories(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<Category[]>(this.apiUrl).subscribe({
            next: (data) => {
                this._categories.set(data);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message || 'Errore durante il caricamento delle categorie');
                this._loading.set(false);
            }
        })
    }

    // TODO: implement createCategory and deleteCategory
}