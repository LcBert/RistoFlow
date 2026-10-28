import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { TablesService } from '../../services/tables.service';
import { TableCardComponent } from './components/table-card/table-card';
import { TableAdd } from './components/table-add/table-add';

@Component({
    imports: [TableCardComponent, TableAdd],
    selector: 'app-tables-page',
    styleUrl: './tables-page.scss',
    templateUrl: './tables-page.html',
})
export class TablesPage implements OnInit {
    protected readonly tablesService = inject(TablesService);
    protected readonly isAddModalOpen = signal(false);

    allTables = this.tablesService.tables;

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
        this.tablesService.loadTables();
    }
}
