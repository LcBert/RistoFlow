import { Component, inject, input, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TablesService } from '../../services/tables.service';
import { Table } from '../../models/restaurant.models';

@Component({
    selector: 'app-table-details',
    imports: [RouterLink],
    templateUrl: './table-details.html',
    styleUrl: './table-details.scss',
})
export class TableDetails implements OnInit {
    private readonly tablesService = inject(TablesService);

    readonly id = input.required<string>();

    protected readonly table = signal<Table | null>(null);
    protected readonly loading = signal<boolean>(true);
    protected readonly error = signal<string | null>(null);

    ngOnInit(): void {
        this.tablesService.getTableById(this.id()).subscribe({
            next: (data) => {
                this.table.set(data);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err.message || 'Errore nel caricamento del tavolo');
                this.loading.set(false);
            },
        });
    }
}
