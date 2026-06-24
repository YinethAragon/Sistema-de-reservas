import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <div class="app-container">
      <app-navbar *ngIf="isLoggedIn$ | async"></app-navbar>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .main-content {
      flex: 1;
      background: #f5f5f5;
    }
  `]
})
export class App {
  private authService = inject(AuthService);
  isLoggedIn$ = this.authService.isLoggedIn$;

  constructor() {
    this.authService.setupAuthStateListener();
  }
}
