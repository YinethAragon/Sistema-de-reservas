import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservasService } from '../../services/reservas.service';
import { RecursosService } from '../../services/recursos.service';
import { AuthService } from '../../services/auth.service';
import { CBAReservas, CBARecursos, CBAUsuarios } from '../../models/cba-models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-section">
        <h1>Bienvenido, {{ currentUser?.nombre }}!</h1>
        <p class="subtitle">Sistema de Gestión de Reservas de Recursos</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ totalRecursos }}</div>
          <div class="stat-label">Recursos Disponibles</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ misReservas.length }}</div>
          <div class="stat-label">Mis Reservas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ reservasConfirmadas }}</div>
          <div class="stat-label">Reservas Confirmadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ reservasPendientes }}</div>
          <div class="stat-label">Reservas Pendientes</div>
        </div>
      </div>

      <div class="content-grid">
        <div class="card">
          <h2>Últimas Reservas</h2>
          <div *ngIf="misReservas.length > 0">
            <div *ngFor="let reserva of misReservas.slice(0, 5)" class="list-item">
              <div class="item-info">
                <p class="item-title">{{ getRecursoNombre(reserva.recursoId) }}</p>
                <p class="item-date">{{ reserva.fechaInicio | date: 'dd/MM/yyyy' }}</p>
              </div>
              <span class="status" [ngClass]="'status-' + reserva.estado">
                {{ reserva.estado }}
              </span>
            </div>
          </div>
          <p *ngIf="misReservas.length === 0" class="empty-message">No tienes reservas</p>
        </div>

        <div class="card">
          <h2>Recursos Populares</h2>
          <div *ngIf="recursosPopulares.length > 0">
            <div *ngFor="let recurso of recursosPopulares" class="list-item">
              <div class="item-info">
                <p class="item-title">{{ recurso.nombre }}</p>
                <p class="item-location">{{ recurso.ubicacion }}</p>
              </div>
              <span class="availability">Disponible</span>
            </div>
          </div>
          <p *ngIf="recursosPopulares.length === 0" class="empty-message">No hay recursos</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
    }

    .welcome-section h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }

    .subtitle {
      margin: 0;
      opacity: 0.9;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .stat-number {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
      margin-bottom: 10px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .card h2 {
      margin-top: 0;
      color: #667eea;
      margin-bottom: 20px;
    }

    .list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }

    .list-item:last-child {
      border-bottom: none;
    }

    .item-info {
      flex: 1;
    }

    .item-title {
      margin: 0;
      font-weight: 500;
      color: #333;
    }

    .item-date, .item-location {
      margin: 5px 0 0 0;
      font-size: 12px;
      color: #999;
    }

    .status {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .status-confirmada {
      background: #d4edda;
      color: #155724;
    }

    .status-pendiente {
      background: #fff3cd;
      color: #856404;
    }

    .status-cancelada {
      background: #f8d7da;
      color: #721c24;
    }

    .availability {
      padding: 4px 12px;
      background: #d4edda;
      color: #155724;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }

    .empty-message {
      color: #999;
      text-align: center;
      padding: 20px;
      font-style: italic;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: CBAUsuarios | null = null;
  misReservas: CBAReservas[] = [];
  recursosPopulares: CBARecursos[] = [];
  totalRecursos = 0;
  reservasConfirmadas = 0;
  reservasPendientes = 0;

  constructor(
    private authService: AuthService,
    private reservasService: ReservasService,
    private recursosService: RecursosService
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.authService.currentUserData$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.cargarReservas();
      }
    });

    this.cargarRecursos();
  }

  cargarReservas() {
    this.reservasService.obtenerReservasDelUsuario(this.currentUser?.id || '').subscribe({
      next: (reservas) => {
        this.misReservas = reservas;
        this.reservasConfirmadas = reservas.filter(r => r.estado === 'confirmada').length;
        this.reservasPendientes = reservas.filter(r => r.estado === 'pendiente').length;
      }
    });
  }

  cargarRecursos() {
    this.recursosService.obtenerRecursos().subscribe({
      next: (recursos) => {
        this.totalRecursos = recursos.length;
        this.recursosPopulares = recursos.slice(0, 5);
      }
    });
  }

  getRecursoNombre(recursoId: string): string {
    return this.recursosPopulares.find(r => r.id === recursoId)?.nombre || 'Recurso desconocido';
  }
}
