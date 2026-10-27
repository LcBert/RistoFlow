import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SettingsService } from './services/settings.service';

@Component({
    imports: [RouterOutlet, RouterLink],
    selector: 'app-root',
    styleUrl: './app.scss',
    templateUrl: './app.html',
})
export class App implements OnInit {
    protected readonly title = signal('frontend');

    protected readonly settingsService = inject(SettingsService);
    protected readonly config = this.settingsService.config;

    ngOnInit(): void {
        this.settingsService.loadConfig();
    }
}
