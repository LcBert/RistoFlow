import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { TableDetails } from './components/table-details/table-details';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'tables/:id', component: TableDetails }
];
