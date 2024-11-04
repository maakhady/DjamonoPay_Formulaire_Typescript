// src/app/services/auth.service.ts
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:3000/api';

//   constructor(private http: HttpClient) {}

//   login(email: string, password: string): Observable<any> {
//     return this.http.post(`${this.apiUrl}/login`, { email, password })
//       .pipe(
//         tap(response => {
//           if (response.success) {
//             localStorage.setItem('user', JSON.stringify(response.user));
//           }
//         })
//       );
//   }

//   logout(): void {
//     localStorage.removeItem('user');
//   }

//   isLoggedIn(): boolean {
//     return !!localStorage.getItem('user');
//   }
// }