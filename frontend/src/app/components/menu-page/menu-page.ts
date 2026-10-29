import { Component, inject, OnInit, signal } from '@angular/core';
import { DishesService } from '../../services/dishes.service';
import { DishCard } from './components/dish-card/dish-card';
import { DishAdd } from './components/dish-add/dish-add';

@Component({
    imports: [DishCard, DishAdd],
    selector: 'app-menu-page',
    styleUrl: './menu-page.scss',
    templateUrl: './menu-page.html',
})
export class MenuPage implements OnInit {
    protected readonly dishesService = inject(DishesService);
    protected readonly isAddModalOpen = signal(false);

    allDishes = this.dishesService.dishes;

    ngOnInit(): void {
        this.dishesService.loadDishes()
    }
}
