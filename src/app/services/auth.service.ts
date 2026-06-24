import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Firestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { CBAUsuarios } from '../models/cba-models';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private currentUserDataSubject = new BehaviorSubject<CBAUsuarios | null>(null);
  public currentUserData$ = this.currentUserDataSubject.asObservable();
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private auth: Auth;
  private db: Firestore;

  constructor(private firebaseService: FirebaseService) {
    this.auth = firebaseService.getAuth();
    this.db = firebaseService.getFirestore();
    this.setupAuthStateListener();
  }

  setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, async (user) => {
      this.currentUserSubject.next(user);
      this.isLoggedInSubject.next(user !== null);
      if (user) {
        await this.loadUserData(user.uid);
      } else {
        this.currentUserDataSubject.next(null);
      }
    });
  }

  async loadUserData(uid: string): Promise<void> {
    try {
      const userRef = doc(this.db, 'usuarios', uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        this.currentUserDataSubject.next(userSnap.data() as CBAUsuarios);
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }

  registro(email: string, password: string, nombre: string): Observable<void> {
    return from(this._registro(email, password, nombre));
  }

  private async _registro(email: string, password: string, nombre: string): Promise<void> {
    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, email, password);
      const usuario: CBAUsuarios = {
        id: credencial.user.uid,
        email,
        nombre,
        rol: 'usuario',
        estado: 'activo',
        fechaRegistro: new Date()
      };

      await setDoc(doc(this.db, 'usuarios', credencial.user.uid), usuario);
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  login(email: string, password: string): Observable<void> {
    return from(this._login(email, password));
  }

  private async _login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  logout(): Observable<void> {
    return from(this._logout());
  }

  private async _logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.currentUserDataSubject.next(null);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  actualizarPerfil(uid: string, datos: Partial<CBAUsuarios>): Observable<void> {
    return from(this._actualizarPerfil(uid, datos));
  }

  private async _actualizarPerfil(uid: string, datos: Partial<CBAUsuarios>): Promise<void> {
    try {
      await updateDoc(doc(this.db, 'usuarios', uid), datos);
      await this.loadUserData(uid);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      throw error;
    }
  }
}
