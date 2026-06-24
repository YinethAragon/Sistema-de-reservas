import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CBAUsuarios } from '../../models/cba-models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand">
          <h1>Sistema de Reservas</h1>
        </div>
        <div class="navbar-menu">
          <a routerLink="/dashboard" class="nav-link">Dashboard</a>
          <a routerLink="/recursos" class="nav-link">Recursos</a>
          <a routerLink="/reservas" class="nav-link">Mis Reservas</a>
          <a *ngIf="currentUser?.rol === 'admin'" routerLink="/admin" class="nav-link admin">
            Panel Admin
          </a>
        </div>
        <div class="navbar-user" *ngIf="currentUser">
          <span class="user-name">{{ currentUser.nombre }}</span>
          <button (click)="logout()" class="btn-logout">Cerrar Sesión</button>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .navbar-brand h1 {
      margin: 0;
      font-size: 24px;
      font-weight: bold;
    }

    .navbar-menu {
      display: flex;
      gap: 30px;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      font-weight: 500;
      transition: opacity 0.3s;
    }

    .nav-link:hover {
      opacity: 0.8;
    }

    .nav-link.admin {
      color: #ffd700;
      font-weight: bold;
    }

    .navbar-user {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-name {
      font-weight: 500;
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid white;
      color: white;
      padding: 8px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.3s;
    }

    .btn-logout:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  `]
})
export class NavbarComponent implements OnInit {
  currentUser: CBAUsuarios | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUserData$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
