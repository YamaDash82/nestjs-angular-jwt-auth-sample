import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-main',
  template: `
    <div class="header">
      <span>ログインユーザー:{{loginUser?.username}}</span>
      <span><button (click)="logout()">ログアウト</button></span>
    </div>
    <div class="main">
      My Application
      <p *ngIf="apiResult">{{apiResult}}</p>
    </div>
    <div class="button-container">
      <button (click)="apiTest()">APITest</button>
    </div>
  `,
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loginUser: { username: string, userId: number } | null = null;
  apiResult = "";

  constructor(
    private auth: AuthService, 
    private api: ApiService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loginUser = this.auth.loginUser;
  }

  apiTest() {
    this.api.hoge().subscribe(data => {
      this.apiResult = data;
    })
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login'])
  }
}
