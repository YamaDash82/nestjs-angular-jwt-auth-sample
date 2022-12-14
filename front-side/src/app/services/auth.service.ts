import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

const jwt = new JwtHelperService();

class DecodedToken {
  exp!: number;
  username!: string;
  userId!: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private decodedToken: DecodedToken;
  private _loginUser: { username: string, userId: number } | null = null;

  constructor(
    private http: HttpClient
  ) { 
    this.decodedToken = localStorage.getItem('auth_meta') ? JSON.parse(localStorage.getItem('auth_meta') as string) : new DecodedToken();
  }

  async login(username: string, password: string): Promise<void> {
    const url = `${environment.rootUrl}/auth/login`;

    try {
      const token = await (async () => {
        return new Promise((resolve, reject) => {
          this.http.post<{ access_token: string }>(url, {username, password}).pipe(
            catchError((error: HttpErrorResponse) => {
              return throwError(() => new Error(error.error.message));
            }), 
            map(token => {
              return token.access_token
            })
          ).subscribe({
            next: (token) => { return resolve(token); }, 
            error: (err) => { return reject(err); }
          });
        })
      })();

      this.saveToken(token);
    } catch (err) {
      throw err;
    }
  }

  private saveToken(token: any): any {
    try {
      this.decodedToken = jwt.decodeToken(token);
      localStorage.setItem('auth_tkn', token);
      localStorage.setItem('auth_meta', JSON.stringify(this.decodedToken));

      const { exp, ...loginUser } = this.decodedToken;

      this._loginUser = loginUser;
    } catch (err) {
      throw err;
    }

    return token;
  }

  async isAutenticated(): Promise<boolean> {
    if (!this.decodedToken) {
      this.logout();
      return false;
    }
    
    //????????????????????????????????????????????????????????????Date#getTime()???????????????????????????????????????????????????Date#getTime()???1000????????????????????????
    if (this.decodedToken.exp < (new Date().getTime() / 1000)) {
      this.logout();
      return false;
    }

    try {
      const url = `${environment.rootUrl}/check-login`;

      const result = await ((): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          //JwtModule?????????????????????????????????JWT?????????????????????????????????
          this.http.get<{ access_token: string }>(url).pipe(
            catchError((err: HttpErrorResponse) => {
              return throwError(() => { new Error(err.error.message); });
            }), 
            tap(data => {
              if(!("access_token" in data)) {
                throw new Error('????????????????????????????????????????????????');
              }

              this.saveToken(data.access_token);
            })
          ).subscribe({
            next: _ => { return resolve(true); }, 
            error: err => { return reject(err); }
          })
        });
      })();
      
      return result;
    } catch (err) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('auth_tkn');
    localStorage.removeItem('autn_meta');

    this.decodedToken = new DecodedToken();
    this._loginUser = null;
  }

  async registerUser(
    username: string, 
    password: string
  ) {
    const url = `${environment.rootUrl}/user-registration`;

    try {
      const result = await (async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
          this.http.post<{ access_token: string }>(url, { username, password}).pipe(
            catchError((err: HttpErrorResponse) => {
              return throwError(() => new Error(err.error.message));
            }), 
            map(data => {
              return data.access_token;
            })
          ).subscribe({
            next: token => {
              this.saveToken(token);
              return resolve(true);
            }, 
            error: err => { return reject(err); }
          })
        });
      })();

      return result;
    } catch (err) {
      throw err;
    }
  }

  get loginUser(): { username: string, userId: number } | null {
    return this._loginUser;
  }
}