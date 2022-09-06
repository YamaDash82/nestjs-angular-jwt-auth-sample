import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
    } catch (err) {
      console.log(`saveTokenError:${err}`);
    }

    return token;
  }

  async isAutenticated(): Promise<boolean> {
    if (!this.decodedToken) {
      this.logout();
      return false;
    }
    
    //トークンの保持している有効期限は秒単位、Date#getTime()で取得される値はミリ秒単位のため、Date#getTime()を1000倍して比較する。
    if (this.decodedToken.exp < (new Date().getTime() / 1000)) {
      this.logout();
      return false;
    }

    const token = localStorage.getItem('auth_tkn');
    if(!token) {
      return false;
    }

    const url = `${environment.rootUrl}/check-login`;

    try {
      const result = await this.http.get<any>(url, {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }).pipe(
        map(token => {
          if(!("access_token" in token)) {
            throw new Error('トークンが取得できませんでした。');
          }

          return token['access_token'];
        })
      ).toPromise();

      const newToken = result;

      this.saveToken(newToken);

      return true;
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
