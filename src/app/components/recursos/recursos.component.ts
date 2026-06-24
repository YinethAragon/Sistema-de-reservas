import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecursosService } from '../../services/recursos.service';
import { AuthService } from '../../services/auth.service';
import { CBARecursos, CBAHorario } from '../../models/cba-models';

@Component({
  selector: 'app-recursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="recursos-container">
      <div class="header">
        <h1>Gestión de Recursos</h1>
        <button *ngIf="currentUser?.rol === 'admin'" (click)="mostrarFormulario = !mostrarFormulario" class="btn-primary">
          {{ mostrarFormulario ? 'Cancelar' : 'Nuevo Recurso' }}
        </button>
      </div>

      <!-- Formulario para crear/editar recursos -->
      <div *ngIf="mostrarFormulario && currentUser?.rol === 'admin'" class="form-card">
        <h2>{{ editandoId ? 'Editar' : 'Crear' }} Recurso</h2>
        <form (ngSubmit)="guardarRecurso()">
          <div class="form-group">
            <label>Nombre del Recurso:</label>
            <input type="text" [(ngModel)]="nuevoRecurso.nombre" name="nombre" required />
          </div>

          <div class="form-group">
            <label>Descripción:</label>
            <textarea [(ngModel)]="nuevoRecurso.descripcion" name="descripcion"></textarea>
          </div>

          <div class="form-group">
            <label>Ubicación:</label>
            <input type="text" [(ngModel)]="nuevoRecurso.ubicacion" name="ubicacion" required />
          </div>

          <div class="form-group">
            <label>Capacidad:</label>
            <input type="number" [(ngModel)]="nuevoRecurso.capacidad" name="capacidad" required />
          </div>

          <button type="submit" class="btn-primary">{{ editandoId ? 'Actualizar' : 'Crear' }}</button>
        </form>
      </div>

      <!-- Lista de recursos -->
      <div class="recursos-grid">
        <div *ngFor="let recurso of recursos" class="recurso-card">
          <div class="card-header">
            <h3>{{ recurso.nombre }}</h3>
            <div *ngIf="currentUser?.rol === 'admin'" class="actions">
              <button (click)="editarRecurso(recurso)" class="btn-sm btn-edit">Editar</button>
              <button (click)="eliminarRecurso(recurso.id)" class="btn-sm btn-delete">Eliminar</button>
            </div>
          </div>

          <p class="descripcion">{{ recurso.descripcion }}</p>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">Ubicación:</span>
              <span class="value">{{ recurso.ubicacion }}</span>
            </div>
            <div class="info-item">
              <span class="label">Capacidad:</span>
              <span class="value">{{ recurso.capacidad }} personas</span>
            </div>
          </div>

          <button class="btn-reservar">Hacer Reserva</button>
        </div>
      </div>

      <p *ngIf="recursos.length === 0" class="empty-message">No hay recursos disponibles</p>
    </div>
  `,
  styles: [`
    .recursos-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .header h1 {
      margin: 0;
      color: #667eea;
    }

    .form-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .form-card h2 {
      margin-top: 0;
      color: #667eea;
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

    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      box-sizing: border-box;
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }

    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 5px rgba(102, 126, 234, 0.3);
    }

    .recursos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .recurso-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: transform 0.2s;
    }

    .recurso-card:hover {
      transform: translateY(-5px);
    }

    .card-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 18px;
    }

    .actions {
      display: flex;
      gap: 5px;
    }

    .btn-sm {
      padding: 4px 8px;
      font-size: 12px;
      border: none;
      border-radius: 3px;
      cursor: pointer;
      transition: opacity 0.2s;
    }

    .btn-edit {
      background: #ffd700;
      color: black;
    }

    .btn-delete {
      background: #ff6b6b;
      color: white;
    }

    .btn-sm:hover {
      opacity: 0.8;
    }

    .descripcion {
      padding: 0 15px;
      margin-top: 15px;
      color: #666;
      font-size: 14px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      padding: 15px;
      background: #f9f9f9;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .label {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
    }

    .value {
      font-weight: 500;
      color: #333;
    }

    .btn-primary, .btn-reservar {
      width: 100%;
      padding: 10px;
      margin: 15px;
      margin-top: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 5px;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s;
    }

    .btn-primary:hover, .btn-reservar:hover {
      transform: translateY(-2px);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .empty-message {
      text-align: center;
      color: #999;
      padding: 40px;
      font-style: italic;
    }
  `]
})
export class RecursosComponent implements OnInit {
  recursos: CBARecursos[] = [];
  currentUser: any;
  mostrarFormulario = false;
  editandoId: string | null = null;
  nuevoRecurso: Partial<CBARecursos> = {};

  constructor(
    private recursosService: RecursosService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.currentUserData$.subscribe(user => {
      this.currentUser = user;
    });
    this.cargarRecursos();
  }

  cargarRecursos() {
    this.recursosService.obtenerRecursos().subscribe({
      next: (recursos) => {
        this.recursos = recursos;
      }
    });
  }

  guardarRecurso() {
    if (!this.nuevoRecurso.nombre || !this.nuevoRecurso.ubicacion) {
      return;
    }

    if (this.editandoId) {
      this.recursosService.actualizarRecurso(this.editandoId, this.nuevoRecurso).subscribe({
        next: () => {
          this.cargarRecursos();
          this.resetearFormulario();
        }
      });
    } else {
      this.recursosService.crearRecurso(this.nuevoRecurso as CBARecursos).subscribe({
        next: () => {
          this.cargarRecursos();
          this.resetearFormulario();
        }
      });
    }
  }

  editarRecurso(recurso: CBARecursos) {
    this.nuevoRecurso = { ...recurso };
    this.editandoId = recurso.id;
    this.mostrarFormulario = true;
  }

  eliminarRecurso(id: string) {
    if (confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
      this.recursosService.eliminarRecurso(id).subscribe({
        next: () => {
          this.cargarRecursos();
        }
      });
    }
  }

  resetearFormulario() {
    this.nuevoRecurso = {};
    this.editandoId = null;
    this.mostrarFormulario = false;
  }
}
