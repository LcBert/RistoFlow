import { Component, effect, inject, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SettingsService } from './services/settings.service';
import { Title } from '@angular/platform-browser';

@Component({
    imports: [RouterOutlet, RouterLink],
    selector: 'app-root',
    styleUrl: './app.scss',
    templateUrl: './app.html',
})
export class App implements OnInit {
    protected readonly titleService = inject(Title);
    protected readonly settingsService = inject(SettingsService);
    protected readonly config = this.settingsService.config;

    constructor() {
        effect(() => {
            const config = this.settingsService.config();
            if (config) {
                this.titleService.setTitle(`${config.name} · Gestionale`);

                if (config.logo) {
                    this.updateFavicon(config.logo);
                }
            }
        });
    }

    private updateFavicon(url: string): void {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = url;
    }

    ngOnInit(): void {
        this.settingsService.loadConfig();
    }
}
