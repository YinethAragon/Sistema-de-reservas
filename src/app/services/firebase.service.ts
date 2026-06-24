import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  db!: Firestore;
  auth!: Auth;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    const app = initializeApp(environment.firebase);
    this.db = getFirestore(app);
    this.auth = getAuth(app);
  }

  getFirestore(): Firestore {
    return this.db;
  }

  getAuth(): Auth {
    return this.auth;
  }
}
