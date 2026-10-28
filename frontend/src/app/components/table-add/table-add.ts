import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablesService } from '../../services/tables.service';
import { RouterLink } from '@angular/router';

@Component({
    imports: [ReactiveFormsModule,RouterLink],
    selector: 'app-table-add',
    styleUrl: './table-add.scss',
    templateUrl: './table-add.html',
})
export class TableAdd implements OnInit {
    protected readonly tablesService = inject(TablesService)
    private readonly fb = inject(FormBuilder);

    protected readonly form = this.fb.nonNullable.group({
        number: ['', [Validators.required]],
        seats: [2, [Validators.required, Validators.min(1)]],
    })

    adjustSeats(delta: number): void {
        const current = this.form.controls.seats.value;
        const next = Math.max(1, current + delta);
        this.form.controls.seats.setValue(next);
    }

    ngOnInit(): void {
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const { number } = this.form.getRawValue();
        const { seats } = this.form.getRawValue();
        this.tablesService.createTable(Number(number), Number(seats))
    }
}
