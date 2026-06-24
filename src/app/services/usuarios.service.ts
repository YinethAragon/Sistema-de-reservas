import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, getDoc, updateDoc, deleteDoc, doc, query, where, Query, CollectionReference } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { CBAUsuarios } from '../../models/cba-models';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private db: Firestore;
  private usuariosSubject = new BehaviorSubject<CBAUsuarios[]>([]);
  public usuarios$ = this.usuariosSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.db = firebaseService.getFirestore();
  }

  async obtenerTodos(): Promise<CBAUsuarios[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, 'usuarios'));
      const usuarios: CBAUsuarios[] = [];
      querySnapshot.forEach((doc) => {
        usuarios.push(doc.data() as CBAUsuarios);
      });
      this.usuariosSubject.next(usuarios);
      return usuarios;
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  }

  async obtenerPorId(id: string): Promise<CBAUsuarios | null> {
    try {
      const docSnap = await getDoc(doc(this.db, 'usuarios', id));
      return docSnap.exists() ? (docSnap.data() as CBAUsuarios) : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  }

  async actualizar(id: string, datos: Partial<CBAUsuarios>): Promise<void> {
    try {
      await updateDoc(doc(this.db, 'usuarios', id), datos);
      await this.obtenerTodos();
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  }

  async cambiarRol(id: string, nuevoRol: 'admin' | 'usuario'): Promise<void> {
    try {
      await updateDoc(doc(this.db, 'usuarios', id), { rol: nuevoRol });
      await this.obtenerTodos();
    } catch (error) {
      console.error('Error cambiando rol:', error);
      throw error;
    }
  }

  async obtenerAdmins(): Promise<CBAUsuarios[]> {
    try {
      const q = query(collection(this.db, 'usuarios'), where('rol', '==', 'admin'));
      const querySnapshot = await getDocs(q);
      const admins: CBAUsuarios[] = [];
      querySnapshot.forEach((doc) => {
        admins.push(doc.data() as CBAUsuarios);
      });
      return admins;
    } catch (error) {
      console.error('Error obteniendo admins:', error);
      throw error;
    }
  }
}
