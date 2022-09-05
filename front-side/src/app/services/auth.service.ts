import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ThisReceiver } from '@angular/compiler';

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

  constructor(private http: HttpClient) { 
    this.decodedToken = localStorage.getItem('auth_meta') ? JSON.parse(localStorage.getItem('auth_meta') as string) : new DecodedToken();
  }

  login(username: string, password: string): Observable<any> {
    const url = `${environment.rootUrl}/auth/login`;

    return this.http.post<any>(url, {username, password}).pipe(
      map(token => {
        return this.saveToken(token[`access_token`]);
      })
    );
  }

  private saveToken(token: any): any {
    try {
      this.decodedToken = jwt.decodeToken(token);
      localStorage.setItem('auth_tkn', token);
      localStorage.setItem('auth_meta', JSON.stringify(this.decodedToken));

      console.log(`
        decodedToken:${this.decodedToken}
        exp:${this.decodedToken.exp}, 
        username::${this.decodedToken.username}
        userId::${this.decodedToken.userId}
      `);
    } catch (err) {
      console.log(`saveTokenError:${err}`);
    }

    return token;
  }

  async isAutenticated(): Promise<boolean> {
    if (!this.decodedToken) {
      console.log(`0`);
      return false;
    }

    if (this.decodedToken.exp < new Date().getTime()) {
      const dt = new Date()
      dt.setTime(this.decodedToken.exp);
      console.log(`１
        有効期限:${this.decodedToken.exp}
        今:${new Date().getTime()}
        ええと:${dt.toString()}
      `);
      return false;
    }

    const token = localStorage.getItem('auth_tkn');
    if(!token) {
      console.log(`２`);
      return false;
    }

    const url = `${environment.rootUrl}/profile`;

    try {
      const result = this.http.get<any>(url, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }).toPromise();

      console.log(result);

      return "username" in result;
    } catch (err) {
      return false;
    }
    

  }

  logout() {
    localStorage.removeItem('autn_tkn');
    localStorage.removeItem('autn_meta');
    this.decodedToken = new DecodedToken();
  }
}
