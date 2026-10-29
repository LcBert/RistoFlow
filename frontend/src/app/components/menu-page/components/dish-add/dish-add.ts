import { Component, inject, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DishesService } from '../../../../services/dishes.service';
import { CategoriesService } from '../../../../services/categories.service';

@Component({
    imports: [ReactiveFormsModule],
    selector: 'app-dish-add',
    styleUrl: './dish-add.scss',
    templateUrl: './dish-add.html',
})
export class DishAdd implements OnInit {
    readonly close = output<void>();

    protected readonly dishesService = inject(DishesService);
    protected readonly categoryService = inject(CategoriesService);
    private readonly fb = inject(FormBuilder);

    protected readonly allCategories = this.categoryService.categories;

    protected readonly form = this.fb.nonNullable.group({
        category: ['', [Validators.required]],
        name: ['', [Validators.required]],
        price: [0.0, [Validators.required, Validators.min(0.01)]],
        description: ['']
    });

    onCancel(): void {
        this.close.emit();
    }

    onSubmit(): void {
        if (this.form.invalid) return;

        const { category, name, price, description } = this.form.getRawValue();
        this.dishesService.createDish(Number(category), name, price, description).subscribe({
            next: () => {
                this.dishesService.loadDishes();
                this.close.emit();
            }
        });
    }

    ngOnInit(): void {
        this.categoryService.loadCategories();
    }
}
