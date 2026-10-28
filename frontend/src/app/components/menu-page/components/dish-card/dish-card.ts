import { Component, computed, input } from '@angular/core';
import { Dish } from '../../../../models/restaurant.models';

@Component({
    imports: [],
    selector: 'app-dish-card',
    styleUrl: './dish-card.scss',
    templateUrl: './dish-card.html',
})
export class DishCard {
    readonly dish = input<Dish>();
    readonly name = input<string>('');
    readonly price = input<number>(0);
    readonly available = input<boolean>(true);

    protected readonly cardName = computed(() => this.dish()?.name ?? this.name());
    protected readonly cardPrice = computed(() => this.dish()?.price ?? this.price());
    protected readonly cardAvailable = computed(() => this.dish()?.is_available ?? this.available());
}
