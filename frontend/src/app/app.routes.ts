import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { TableDetails } from './components/table-details/table-details';
import { TableOpen } from './components/table-open/table-open';
import { TablesPage } from './components/tables-page/tables-page';
import { TableAdd } from './components/table-add/table-add';
import { Settings } from './components/settings/settings';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'tables', component: TablesPage },
    { path: 'tables/open', component: TableOpen },
    { path: 'tables/add', component: TableAdd },
    { path: 'tables/:id', component: TableDetails },
    { path: 'settings', component: Settings },
];
