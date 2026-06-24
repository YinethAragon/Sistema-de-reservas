import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Sistema de Reservas</h1>
        <p class="subtitle">Gestión de Recursos y Reservas</p>

        <div *ngIf="activeTab === 'login'">
          <h2>Iniciar Sesión</h2>
          <form (ngSubmit)="login()">
            <div class="form-group">
              <label>Correo:</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="tu@email.com"
              />
            </div>
            <div class="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
              />
            </div>
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
            </button>
          </form>
          <p class="toggle-text">
            ¿No tienes cuenta?
            <a (click)="activeTab = 'register'" class="link">Regístrate aquí</a>
          </p>
        </div>

        <div *ngIf="activeTab === 'register'">
          <h2>Crear Cuenta</h2>
          <form (ngSubmit)="register()">
            <div class="form-group">
              <label>Nombre Completo:</label>
              <input
                type="text"
                [(ngModel)]="nombreCompleto"
                name="nombreCompleto"
                required
                placeholder="Tu nombre"
              />
            </div>
            <div class="form-group">
              <label>Correo:</label>
              <input
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                placeholder="tu@email.com"
              />
            </div>
            <div class="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                [(ngModel)]="password"
                name="password"
                required
                placeholder="••••••••"
              />
            </div>
            <button type="submit" class="btn-primary" [disabled]="loading">
              {{ loading ? 'Registrando...' : 'Registrarse' }}
            </button>
          </form>
          <p class="toggle-text">
            ¿Ya tienes cuenta?
            <a (click)="activeTab = 'login'" class="link">Inicia sesión aquí</a>
          </p>
        </div>

        <div *ngIf="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 400px;
      width: 100%;
    }

    h1 {
      text-align: center;
      color: #667eea;
      margin-bottom: 5px;
    }

    .subtitle {
      text-align: center;
      color: #666;
      margin-bottom: 30px;
    }

    h2 {
      color: #667eea;
      margin-bottom: 20px;
      font-size: 20px;
    }

    .form-group {
      margin-bottom: 15px;
    }

    label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    .btn-primary {
      width: 100%;
      padding: 12px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .toggle-text {
      text-align: center;
      margin-top: 15px;
      color: #666;
    }

    .link {
      color: #667eea;
      cursor: pointer;
      text-decoration: underline;
      font-weight: 500;
    }

    .error-message {
      margin-top: 15px;
      padding: 10px;
      background: #fee;
      color: #c33;
      border-radius: 5px;
      border: 1px solid #fcc;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  nombreCompleto = '';
  activeTab: 'login' | 'register' = 'login';
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.error = '';
    this.loading = true;
    
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.error = err.message || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }

  register() {
    this.error = '';
    this.loading = true;
    
    this.authService.registro(this.email, this.password, this.nombreCompleto).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        this.error = err.message || 'Error al registrarse';
        this.loading = false;
      }
    });
  }
}
