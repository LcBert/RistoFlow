import { Component, computed, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TablesService } from '../../../services/tables.service';

@Component({
    selector: 'app-table-open',
    imports: [ReactiveFormsModule],
    templateUrl: './table-open.html',
    styleUrl: './table-open.scss',
})
export class TableOpen implements OnInit {
    protected readonly tablesService = inject(TablesService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    protected readonly freeTables = computed(() =>
        this.tablesService.tables().filter((t) => t.status === "FREE")
    );

    protected readonly form = this.fb.nonNullable.group({
        tableNumber: ['', [Validators.required]],
        covers: [2, [Validators.required, Validators.min(1)]],
        notes: [''],
    });

    ngOnInit(): void {
        this.tablesService.loadTables();
    }

    onTableChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        const selected = this.freeTables().find((t) => t.number === Number(select.value));
        if (selected) {
            this.form.patchValue({ covers: selected.seats });
        }
    }

    adjustCovers(delta: number): void {
        const current = this.form.controls.covers.value;
        if (current + delta >= 1) {
            this.form.controls.covers.setValue(current + delta);
        }
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const { tableNumber } = this.form.getRawValue();
        this.tablesService.updateStatus(Number(tableNumber), 'OCCUPIED');
        this.router.navigate(['/tables', tableNumber]);
    }
}
