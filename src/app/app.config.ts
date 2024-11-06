// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { provideClientHydration } from '@angular/platform-browser';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration()]
// };



import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http'

// Importez les styles Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient()
  ]
};