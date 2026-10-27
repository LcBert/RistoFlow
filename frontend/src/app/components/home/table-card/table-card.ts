import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Table } from '../../../models/restaurant.models';

@Component({
  selector: 'app-table-card',
  imports: [RouterLink],
  styleUrl: './table-card.scss',
  templateUrl: './table-card.html',
})
export class TableCardComponent {
  readonly table = input<Table>();
  readonly number = input<number>(0);
  readonly status = input<string>('');

  protected readonly cardNumber = computed(() => this.table()?.number ?? this.number());
  protected readonly cardStatus = computed(() => this.table()?.status_display ?? this.table()?.status ?? this.status());
  protected readonly cardSeats = computed(() => this.table()?.seats);
  protected readonly cardRoute = computed(() => `/tables/${this.table()?.id ?? this.cardNumber()}`);
  protected readonly statusCode = computed(() => (this.table()?.status ?? this.status() ?? 'FREE').toLowerCase());
}
