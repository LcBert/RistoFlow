import { Component, computed, inject, OnInit } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { TableCardComponent } from './components/table-card/table-card';
import { RouterLink } from '@angular/router';

@Component({
    imports: [TableCardComponent, RouterLink],
    selector: 'app-tables-page',
    styleUrl: './tables-page.scss',
    templateUrl: './tables-page.html',
})
export class TablesPage implements OnInit {
    protected readonly tablesService = inject(TablesService)

    allTables = this.tablesService.tables

    protected readonly freeTables = computed(() =>
        this.allTables().filter((t) => t.status === "FREE")
    );

    protected readonly occupiedTables = computed(() =>
        this.allTables().filter((t) => t.status === "OCCUPIED")
    );

    protected readonly reservedTables = computed(() =>
        this.allTables().filter((t) => t.status === "RESERVED")
    );

    ngOnInit(): void {
        this.tablesService.loadTables()
    }
}
