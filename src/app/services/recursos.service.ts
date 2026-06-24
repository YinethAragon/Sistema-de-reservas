import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { CBARecursos } from '../models/cba-models';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecursosService {
  private db: Firestore;
  private recursosSubject = new BehaviorSubject<CBARecursos[]>([]);
  public recursos$ = this.recursosSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.db = firebaseService.getFirestore();
  }

  // Métodos con Observable para componentes
  crearRecurso(recurso: CBARecursos): Observable<void> {
    return from(this._crearRecurso(recurso));
  }

  obtenerRecursos(): Observable<CBARecursos[]> {
    return from(this.obtenerTodos());
  }

  actualizarRecurso(id: string, datos: Partial<CBARecursos>): Observable<void> {
    return from(this.actualizar(id, datos));
  }

  eliminarRecurso(id: string): Observable<void> {
    return from(this.eliminar(id));
  }

  private async _crearRecurso(recurso: CBARecursos): Promise<void> {
    try {
      const { id, ...datosRecurso } = recurso;
      await this.crear(datosRecurso);
    } catch (error) {
      console.error('Error en crearRecurso:', error);
      throw error;
    }
  }

  async crear(recurso: Omit<CBARecursos, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(this.db, 'recursos'), recurso);
      await this.obtenerTodos();
      return docRef.id;
    } catch (error) {
      console.error('Error creando recurso:', error);
      throw error;
    }
  }

  async obtenerTodos(): Promise<CBARecursos[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'recursos'));
      const recursos: CBARecursos[] = [];
      querySnapshot.forEach((doc) => {
        recursos.push({ ...doc.data(), id: doc.id } as CBARecursos);
      });
      this.recursosSubject.next(recursos);
      return recursos;
    } catch (error) {
      console.error('Error obteniendo recursos:', error);
      throw error;
    }
  }

  async obtenerPorId(id: string): Promise<CBARecursos | null> {
    try {
      const docSnap = await getDoc(doc(this.db, 'recursos', id));
      return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } as CBARecursos : null;
    } catch (error) {
      console.error('Error obteniendo recurso:', error);
      throw error;
    }
  }

  async actualizar(id: string, datos: Partial<CBARecursos>): Promise<void> {
    try {
      await updateDoc(doc(this.db, 'recursos', id), datos);
      await this.obtenerTodos();
    } catch (error) {
      console.error('Error actualizando recurso:', error);
      throw error;
    }
  }

  async eliminar(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, 'recursos', id));
      await this.obtenerTodos();
    } catch (error) {
      console.error('Error eliminando recurso:', error);
      throw error;
    }
  }

  async obtenerPorTipo(tipo: string): Promise<CBARecursos[]> {
    try {
      const q = query(collection(this.db, 'recursos'), where('tipo', '==', tipo));
      const querySnapshot = await getDocs(q);
      const recursos: CBARecursos[] = [];
      querySnapshot.forEach((doc) => {
        recursos.push({ ...doc.data(), id: doc.id } as CBARecursos);
      });
      return recursos;
    } catch (error) {
      console.error('Error obteniendo recursos por tipo:', error);
      throw error;
    }
  }

  async obtenerDisponibles(): Promise<CBARecursos[]> {
    try {
      const q = query(collection(this.db, 'recursos'), where('estado', '==', 'disponible'));
      const querySnapshot = await getDocs(q);
      const recursos: CBARecursos[] = [];
      querySnapshot.forEach((doc) => {
        recursos.push({ ...doc.data(), id: doc.id } as CBARecursos);
      });
      return recursos;
    } catch (error) {
      console.error('Error obteniendo recursos disponibles:', error);
      throw error;
    }
  }
}
