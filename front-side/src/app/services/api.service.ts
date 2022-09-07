import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  hoge(): Observable<string> {
    const url = `${environment.rootUrl}/api/hoge`;

    const token = localStorage.getItem('auth_tkn');
    
    return this.http.get(url, 
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
        }),
        responseType: "text"
      }
    );
  }
}
