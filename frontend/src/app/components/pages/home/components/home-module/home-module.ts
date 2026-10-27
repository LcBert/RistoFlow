import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface HomeModuleItem {
  title: string;
  description: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-home-module',
  imports: [RouterLink],
  styleUrl: './home-module.scss',
  templateUrl: './home-module.html',
})
export class HomeModuleComponent {
  readonly module = input.required<HomeModuleItem>();
}

export { HomeModuleComponent as HomeModule };
