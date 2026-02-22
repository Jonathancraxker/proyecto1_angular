import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';
import { updatePrimaryPalette } from '@primeuix/themes';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
            theme: {
                preset: Nora,
                options: {
                  darkModeSelector: '.my-app-dark',
                } 
            }
        }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
