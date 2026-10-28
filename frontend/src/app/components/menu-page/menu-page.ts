import { Component, inject, OnInit } from '@angular/core';
import { DishesService } from '../../services/dishes.service';
import { DishCard } from './components/dish-card/dish-card';

@Component({
    imports: [DishCard],
    selector: 'app-menu-page',
    styleUrl: './menu-page.scss',
    templateUrl: './menu-page.html',
})
export class MenuPage implements OnInit {
    protected readonly dishesService = inject(DishesService);

    allDishes = this.dishesService.dishes;

    ngOnInit(): void {
        this.dishesService.loadDishes()
    }
}
