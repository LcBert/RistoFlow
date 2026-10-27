import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  styleUrl: './settings.scss',
  templateUrl: './settings.html',
})
export class Settings implements OnInit {
  protected readonly settingsService = inject(SettingsService);
  private readonly fb = inject(FormBuilder);

  protected readonly successMessage = signal<boolean>(false);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(150)]],
  });

  constructor() {
    effect(() => {
      const config = this.settingsService.config();
      if (config) {
        this.form.patchValue({
          name: config.name,
        });
      }
    });
  }

  ngOnInit(): void {
    this.settingsService.loadConfig();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.settingsService.updateConfig(this.form.getRawValue());
    this.successMessage.set(true);
    setTimeout(() => this.successMessage.set(false), 3000);
  }
}
