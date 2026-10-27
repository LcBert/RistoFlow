import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { RestaurantSettings as RestaurantConfig } from "../models/restaurant.models";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `http://${window.location.hostname}:8000/api/config/`;

    private readonly _config = signal<RestaurantConfig | null>(null);
    private readonly _loading = signal<boolean>(false);
    private readonly _error = signal<string | null>(null);

    readonly config = this._config.asReadonly();
    readonly loading = this._loading.asReadonly();
    readonly error = this._error.asReadonly();

    loadConfig(): void {
        this._loading.set(true);
        this._error.set(null);

        this.http.get<RestaurantConfig>(this.apiUrl).subscribe({
            next: (data) => {
                this._config.set(data);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message || "Errore nel caricamento delle impostazione");
                this._loading.set(false);
            }
        })
    }

    updateConfig(payload: FormData | Partial<RestaurantConfig>): void {
        this._loading.set(true);

        this.http.patch<RestaurantConfig>(this.apiUrl, payload).subscribe({
            next: (updated) => {
                this._config.set(updated);
                this._loading.set(false);
            },
            error: (err) => {
                this._error.set(err.message || 'Errore durante il salvataggio delle impostazioni');
                this._loading.set(false);
            }
        });
    }

}