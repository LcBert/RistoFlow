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
  protected selectedFile: File | null = null;
  protected previewUrl: string | null = null;

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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const formData = new FormData();
    formData.append('name', this.form.controls.name.value);
    if (this.selectedFile) {
      formData.append('logo', this.selectedFile);
    }

    this.settingsService.updateConfig(formData);
    this.successMessage.set(true);
    setTimeout(() => this.successMessage.set(false), 3000);
  }
}
