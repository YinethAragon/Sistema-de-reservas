// Modelo: CBAUsuarios
export interface CBAUsuarios {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  estado: 'activo' | 'inactivo';
  fechaRegistro: Date;
  telefono?: string;
}

// Modelo: CBARecursos (Salas, Equipos, Laboratorios, etc.)
export interface CBARecursos {
  id: string;
  nombre: string;
  descripcion: string;
  tipo?: 'sala' | 'equipo' | 'laboratorio' | 'otro';
  capacidad: number;
  ubicacion: string;
  estado?: 'disponible' | 'mantenimiento' | 'no-disponible';
  imagen?: string;
  horariosDisponibles?: CBAHorario[];
  fechaCreacion?: Date;
  creadoPor?: string; // ID del usuario admin
}

// Modelo: CBAReservas
export interface CBAReservas {
  id: string;
  usuarioId: string;
  recursoId: string;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  proposito?: string;
  propositoReserva?: string;
  notas?: string;
  fechaCreacion?: Date | string;
}

// Modelo: CBAHorario (Horarios disponibles de los recursos)
export interface CBAHorario {
  id: string;
  diaSemana: number; // 0-6 (Lunes-Domingo)
  horaInicio: string; // HH:mm
  horaFin: string; // HH:mm
  activo: boolean;
}

// Modelo: CBAHistorial (Historial de reservas)
export interface CBAHistorial {
  id: string;
  usuarioId: string;
  recursoId: string;
  accion: 'creada' | 'modificada' | 'cancelada' | 'completada';
  fechaAccion: Date;
  detalles?: string;
}
