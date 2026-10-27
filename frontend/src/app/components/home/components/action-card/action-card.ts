import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface ActionCardItem {
  title: string;
  route: string;
  icon?: string;
}

@Component({
  selector: 'app-action-card',
  imports: [RouterLink],
  templateUrl: './action-card.html',
  styleUrl: './action-card.scss',
})
export class ActionCardComponent {
  readonly action = input<ActionCardItem>();
  readonly title = input<string>('');
  readonly route = input<string>('');
  readonly icon = input<string>('');

  protected readonly cardTitle = computed(() => this.action()?.title ?? this.title());
  protected readonly cardRoute = computed(() => this.action()?.route ?? this.route());
  protected readonly cardIcon = computed(() => this.action()?.icon ?? this.icon());
}
