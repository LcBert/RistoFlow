import { Component, inject } from '@angular/core';
import { ActionCardComponent, ActionCardItem } from './action-card/action-card';
import { TableCardComponent } from './table-card/table-card';
import { TablesService } from '../../services/tables.service';

@Component({
    imports: [ActionCardComponent, TableCardComponent],
    selector: 'app-home',
    styleUrl: './home.scss',
    templateUrl: './home.html',
})
export class Home {
    protected readonly tablesService = inject(TablesService)

    protected readonly actions: ActionCardItem[] = [
        {
            title: "Gestione Sala e Tavoli",
            route: "/tables",
            // icon: "🪑",
        },
        {
            title: 'Comande Attive',
            route: "/orders",
        }
    ];

    ngOnInit(): void {
        this.tablesService.loadTables();
    }
}
