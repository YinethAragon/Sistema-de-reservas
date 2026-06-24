import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { FirebaseService } from './services/firebase.service';
import { AuthService } from './services/auth.service';
import { RecursosService } from './services/recursos.service';
import { ReservasService } from './services/reservas.service';
import { UsuariosService } from './services/usuarios.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    FirebaseService,
    AuthService,
    RecursosService,
    ReservasService,
    UsuariosService
  ]
};
