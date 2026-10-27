import { Component, inject, OnInit } from '@angular/core';
import { ActionCardComponent, ActionCardItem } from './components/action-card/action-card';
import { HomeModuleComponent, HomeModuleItem } from './components/home-module/home-module';
import { TablesService } from '../../services/tables.service';

@Component({
    imports: [ActionCardComponent, HomeModuleComponent],
    selector: 'app-home',
    styleUrl: './home.scss',
    templateUrl: './home.html',
})
export class Home implements OnInit {
    protected readonly tablesService = inject(TablesService);

    protected readonly actions: ActionCardItem[] = [
        {
            title: 'Nuovo tavolo / Comanda',
            route: 'tables/open',
            icon: 'table',
        },
        {
            title: 'Nuova Prenotazione',
            route: 'reservation/new',
            icon: 'calendar',
        },
        {
            title: 'Ordine Asporto',
            route: 'orders/takeaway',
            icon: 'bag',
        },
        {
            title: 'Impostazioni',
            route: 'settings/',
            icon: 'settings',
        },
    ];

    protected readonly modules: HomeModuleItem[] = [
        {
            title: 'Tavoli',
            description: 'Stato occupazione e gestione dei tavoli.',
            route: 'tables/',
            icon: 'table',
        },
        {
            title: 'Menu e Listino',
            description: 'Categorie, ingredienti, prezzi e disponibilità piatti.',
            route: 'menu/',
            icon: 'menu',
        },
        {
            title: 'Monitor Cucina',
            description: 'Comande in tempo reale, tempi di uscita e priorità delle portate.',
            route: 'kitchen/',
            icon: 'cook',
        },
        {
            title: 'Cassa e Chiusure',
            description: 'Emissione scontrini, split del conto e resoconto cassa di fine turno.',
            route: 'billing/',
            icon: 'cash',
        },

    ];

    ngOnInit(): void {
        this.tablesService.loadTables();
    }
}
