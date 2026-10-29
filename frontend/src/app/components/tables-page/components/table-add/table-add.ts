import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablesService } from '../../../../services/tables.service';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-table-add',
    styleUrl: './table-add.scss',
    templateUrl: './table-add.html',
})
export class TableAdd {
    readonly close = output<void>();

    protected readonly tablesService = inject(TablesService);
    private readonly fb = inject(FormBuilder);

    protected readonly form = this.fb.nonNullable.group({
        number: ['', [Validators.required]],
        seats: [2, [Validators.required, Validators.min(1)]],
    });

    adjustSeats(delta: number): void {
        const current = this.form.controls.seats.value;
        const next = Math.max(1, current + delta);
        this.form.controls.seats.setValue(next);
    }

    onCancel(): void {
        this.close.emit();
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const { number, seats } = this.form.getRawValue();
        this.tablesService.createTable(Number(number), Number(seats)).subscribe({
            next: () => {
                this.tablesService.loadTables()
            }
        })
        this.close.emit();
    }
}
