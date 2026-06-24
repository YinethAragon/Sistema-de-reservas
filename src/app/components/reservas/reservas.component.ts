import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../services/reservas.service';
import { RecursosService } from '../../services/recursos.service';
import { AuthService } from '../../services/auth.service';
import { CBAReservas, CBARecursos } from '../../models/cba-models';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reservas-container">
      <div class="header">
        <h1>Sistema de Reservas</h1>
      </div>

      <div class="content-grid">
        <!-- Formulario de nueva reserva -->
        <div class="card form-card">
          <h2>Nueva Reserva</h2>
          <form (ngSubmit)="crearReserva()">
            <div class="form-group">
              <label>Recurso:</label>
              <select [(ngModel)]="nuevaReserva.recursoId" name="recursoId" required>
                <option value="">Selecciona un recurso</option>
                <option *ngFor="let recurso of recursosDisponibles" value="{{ recurso.id }}">
                  {{ recurso.nombre }} - {{ recurso.ubicacion }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Fecha Inicio:</label>
              <input type="datetime-local" [(ngModel)]="nuevaReserva.fechaInicio" name="fechaInicio" required />
            </div>

            <div class="form-group">
              <label>Fecha Fin:</label>
              <input type="datetime-local" [(ngModel)]="nuevaReserva.fechaFin" name="fechaFin" required />
            </div>

            <div class="form-group">
              <label>Propósito:</label>
              <textarea [(ngModel)]="nuevaReserva.proposito" name="proposito"></textarea>
            </div>

            <button type="submit" class="btn-primary">Crear Reserva</button>
          </form>
        </div>

        <!-- Lista de reservas -->
        <div class="card">
          <h2>Mis Reservas</h2>
          <div *ngIf="misReservas.length > 0">
            <div *ngFor="let reserva of misReservas" class="reserva-item">
              <div class="reserva-info">
                <h3>{{ getRecursoNombre(reserva.recursoId) }}</h3>
                <p class="dates">
                  {{ reserva.fechaInicio | date: 'dd/MM/yyyy HH:mm' }} -
                  {{ reserva.fechaFin | date: 'dd/MM/yyyy HH:mm' }}
                </p>
                <p class="proposito" *ngIf="reserva.proposito">{{ reserva.proposito }}</p>
              </div>
              <div class="reserva-actions">
                <span class="status" [ngClass]="'status-' + reserva.estado">
                  {{ reserva.estado }}
                </span>
                <button *ngIf="reserva.estado === 'pendiente'" (click)="cancelarReserva(reserva.id)" class="btn-cancel">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          <p *ngIf="misReservas.length === 0" class="empty-message">No tienes reservas</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reservas-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      color: #667eea;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 768px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .form-card {
      height: fit-content;
    }

    .card h2 {
      margin-top: 0;
      color: #667eea;
      margin-bottom: 20px;
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

    input, select, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
    }

    textarea {
      resize: vertical;
      min-height: 60px;
    }

    input:focus, select:focus, textarea:focus {
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
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
    }

    .reserva-item {
      display: flex;
      justify-content: space-between;
      align-items: start;
      padding: 15px;
      border: 1px solid #eee;
      border-radius: 5px;
      margin-bottom: 10px;
    }

    .reserva-info h3 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .dates {
      font-size: 13px;
      color: #666;
      margin: 5px 0;
    }

    .proposito {
      font-size: 12px;
      color: #999;
      margin: 8px 0 0 0;
      font-style: italic;
    }

    .reserva-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
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

    .btn-cancel {
      padding: 6px 12px;
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-cancel:hover {
      opacity: 0.8;
    }

    .empty-message {
      text-align: center;
      color: #999;
      padding: 20px;
      font-style: italic;
    }
  `]
})
export class ReservasComponent implements OnInit {
  nuevaReserva: Partial<CBAReservas> = {};
  misReservas: CBAReservas[] = [];
  recursosDisponibles: CBARecursos[] = [];
  currentUser: any;

  constructor(
    private reservasService: ReservasService,
    private recursosService: RecursosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cargarReservas();
    });
    this.cargarRecursos();
  }

  cargarRecursos() {
    this.recursosService.obtenerRecursos().subscribe({
      next: (recursos) => {
        this.recursosDisponibles = recursos;
      }
    });
  }

  cargarReservas() {
    if (this.currentUser) {
      this.reservasService.obtenerReservasDelUsuario(this.currentUser.uid).subscribe({
        next: (reservas) => {
          this.misReservas = reservas;
        }
      });
    }
  }

  crearReserva() {
    if (!this.nuevaReserva.recursoId || !this.nuevaReserva.fechaInicio || !this.nuevaReserva.fechaFin) {
      return;
    }

    const reserva: CBAReservas = {
      id: '',
      usuarioId: this.currentUser.uid,
      recursoId: this.nuevaReserva.recursoId,
      fechaInicio: this.nuevaReserva.fechaInicio,
      fechaFin: this.nuevaReserva.fechaFin,
      proposito: this.nuevaReserva.proposito || '',
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString()
    };

    this.reservasService.crearReserva(reserva).subscribe({
      next: () => {
        this.cargarReservas();
        this.nuevaReserva = {};
      }
    });
  }

  cancelarReserva(id: string) {
    if (confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      this.reservasService.cancelarReserva(id).subscribe({
        next: () => {
          this.cargarReservas();
        }
      });
    }
  }

  getRecursoNombre(recursoId: string): string {
    return this.recursosDisponibles.find(r => r.id === recursoId)?.nombre || 'Recurso desconocido';
  }
}
