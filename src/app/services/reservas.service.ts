import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { CBAReservas, CBAHistorial } from '../models/cba-models';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private db: Firestore;
  private reservasSubject = new BehaviorSubject<CBAReservas[]>([]);
  public reservas$ = this.reservasSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.db = firebaseService.getFirestore();
  }

  // Métodos con Observable para componentes
  crearReserva(reserva: CBAReservas): Observable<void> {
    return from(this._crearReserva(reserva));
  }

  obtenerReservasDelUsuario(usuarioId: string): Observable<CBAReservas[]> {
    return from(this.obtenerPorUsuario(usuarioId));
  }

  cancelarReserva(id: string): Observable<void> {
    return from(this.cancelar(id));
  }

  private async _crearReserva(reserva: CBAReservas): Promise<void> {
    try {
      const { id, ...datosReserva } = reserva;
      await this.crear(datosReserva);
    } catch (error) {
      console.error('Error en crearReserva:', error);
      throw error;
    }
  }

  async crear(reserva: Omit<CBAReservas, 'id'>): Promise<string> {
    try {
      // Validar conflictos de horario
      await this.validarConflictoHorario(reserva.recursoId, reserva.fechaInicio, reserva.fechaFin);

      const docRef = await addDoc(collection(this.db, 'reservas'), reserva);

      // Agregar al historial
      await this.agregarAlHistorial(reserva.usuarioId, reserva.recursoId, 'creada', 'Reserva creada');

      await this.obtenerTodos();
      return docRef.id;
    } catch (error) {
      console.error('Error creando reserva:', error);
      throw error;
    }
  }

  async obtenerTodos(): Promise<CBAReservas[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'reservas'));
      const reservas: CBAReservas[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reservas.push({
          ...data,
          id: doc.id,
          fechaInicio: data['fechaInicio'].toDate?.() || new Date(data['fechaInicio']),
          fechaFin: data['fechaFin'].toDate?.() || new Date(data['fechaFin']),
          fechaCreacion: data['fechaCreacion'].toDate?.() || new Date(data['fechaCreacion'])
        } as CBAReservas);
      });
      this.reservasSubject.next(reservas);
      return reservas;
    } catch (error) {
      console.error('Error obteniendo reservas:', error);
      throw error;
    }
  }

  async obtenerPorUsuario(usuarioId: string): Promise<CBAReservas[]> {
    try {
      const q = query(collection(this.db, 'reservas'), where('usuarioId', '==', usuarioId));
      const querySnapshot = await getDocs(q);
      const reservas: CBAReservas[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reservas.push({
          ...data,
          id: doc.id,
          fechaInicio: data['fechaInicio'].toDate?.() || new Date(data['fechaInicio']),
          fechaFin: data['fechaFin'].toDate?.() || new Date(data['fechaFin']),
          fechaCreacion: data['fechaCreacion'].toDate?.() || new Date(data['fechaCreacion'])
        } as CBAReservas);
      });
      return reservas;
    } catch (error) {
      console.error('Error obteniendo reservas del usuario:', error);
      throw error;
    }
  }

  async obtenerPorRecurso(recursoId: string): Promise<CBAReservas[]> {
    try {
      const q = query(collection(this.db, 'reservas'), where('recursoId', '==', recursoId));
      const querySnapshot = await getDocs(q);
      const reservas: CBAReservas[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reservas.push({
          ...data,
          id: doc.id,
          fechaInicio: data['fechaInicio'].toDate?.() || new Date(data['fechaInicio']),
          fechaFin: data['fechaFin'].toDate?.() || new Date(data['fechaFin']),
          fechaCreacion: data['fechaCreacion'].toDate?.() || new Date(data['fechaCreacion'])
        } as CBAReservas);
      });
      return reservas;
    } catch (error) {
      console.error('Error obteniendo reservas del recurso:', error);
      throw error;
    }
  }

  async obtenerPorId(id: string): Promise<CBAReservas | null> {
    try {
      const docSnap = await getDoc(doc(this.db, 'reservas', id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          id: docSnap.id,
          fechaInicio: data['fechaInicio'].toDate?.() || new Date(data['fechaInicio']),
          fechaFin: data['fechaFin'].toDate?.() || new Date(data['fechaFin']),
          fechaCreacion: data['fechaCreacion'].toDate?.() || new Date(data['fechaCreacion'])
        } as CBAReservas;
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo reserva:', error);
      throw error;
    }
  }

  async actualizar(id: string, datos: Partial<CBAReservas>): Promise<void> {
    try {
      const reserva = await this.obtenerPorId(id);
      if (reserva) {
        await updateDoc(doc(this.db, 'reservas', id), datos);
        await this.agregarAlHistorial(reserva.usuarioId, reserva.recursoId, 'modificada', 'Reserva modificada');
        await this.obtenerTodos();
      }
    } catch (error) {
      console.error('Error actualizando reserva:', error);
      throw error;
    }
  }

  async cancelar(id: string): Promise<void> {
    try {
      const reserva = await this.obtenerPorId(id);
      if (reserva) {
        await updateDoc(doc(this.db, 'reservas', id), { estado: 'cancelada' });
        await this.agregarAlHistorial(reserva.usuarioId, reserva.recursoId, 'cancelada', 'Reserva cancelada');
        await this.obtenerTodos();
      }
    } catch (error) {
      console.error('Error cancelando reserva:', error);
      throw error;
    }
  }

  async eliminar(id: string): Promise<void> {
    try {
      const reserva = await this.obtenerPorId(id);
      if (reserva) {
        await deleteDoc(doc(this.db, 'reservas', id));
        await this.agregarAlHistorial(reserva.usuarioId, reserva.recursoId, 'cancelada', 'Reserva eliminada');
        await this.obtenerTodos();
      }
    } catch (error) {
      console.error('Error eliminando reserva:', error);
      throw error;
    }
  }

  /**
   * Valida si hay conflictos de horario
   */
  private async validarConflictoHorario(recursoId: string, fechaInicio: any, fechaFin: any): Promise<void> {
    try {
      const q = query(
        collection(this.db, 'reservas'),
        where('recursoId', '==', recursoId),
        where('estado', 'in', ['pendiente', 'confirmada'])
      );
      const querySnapshot = await getDocs(q);

      for (const docSnap of querySnapshot.docs) {
        const reservaExistente = docSnap.data();
        const inicioExistente = new Date(reservaExistente['fechaInicio'].seconds * 1000);
        const finExistente = new Date(reservaExistente['fechaFin'].seconds * 1000);
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        // Verificar si hay solapamiento
        if (inicio < finExistente && fin > inicioExistente) {
          throw new Error('Hay un conflicto de horario con otra reserva');
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('conflicto')) {
        throw error;
      }
      console.error('Error validando conflicto:', error);
    }
  }

  private async agregarAlHistorial(usuarioId: string, recursoId: string, accion: string, detalles: string): Promise<void> {
    try {
      const historial: CBAHistorial = {
        id: '',
        usuarioId: usuarioId,
        recursoId: recursoId,
        accion: accion as 'creada' | 'modificada' | 'cancelada' | 'completada',
        fechaAccion: new Date(),
        detalles: detalles
      };
      await addDoc(collection(this.db, 'historial'), historial);
    } catch (error) {
      console.error('Error agregando al historial:', error);
    }
  }
}
