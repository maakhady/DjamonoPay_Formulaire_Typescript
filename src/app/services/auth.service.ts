import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api'; // URL de votre API

  constructor(private http: HttpClient) { }

  // Vérification d'un champ spécifique
  verifyField(field: string, value: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/verify-field`, { field, value });
  }

  // Authentification complète
  login(credentials: {
    email: string,
    password: string,
    firstName: string,
    lastName: string
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials);
  }

  // Stocker le token après connexion réussie
  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  // Récupérer le token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Vérifier si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // Déconnexion
  logout(): void {
    localStorage.removeItem('auth_token');
  }
}