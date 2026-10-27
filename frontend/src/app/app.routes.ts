import { Routes } from '@angular/router';
import { Home } from './components/pages/home/home';
import { TableDetails } from './components/pages/table-details/table-details';
import { TableOpen } from './components/pages/table-open/table-open';
import { TablesPage } from './components/pages/tables-page/tables-page';
import { TableAdd } from './components/pages/table-add/table-add';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'tables', component: TablesPage },
    { path: 'tables/open', component: TableOpen },
    { path: 'tables/add', component: TableAdd },
    { path: 'tables/:id', component: TableDetails },
];
