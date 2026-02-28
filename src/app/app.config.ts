import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Nora from '@primeuix/themes/nora';
import { updatePrimaryPalette } from '@primeuix/themes';
import { definePreset } from '@primeuix/themes';
import { routes } from './app.routes';

const MyPreset = definePreset(Nora, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}'
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
            theme: {
                preset: MyPreset,
                options: {
                  // darkModeSelector: '.my-app-dark',
                } 
            }
        }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
