import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div>
      <label>
        ユーザ名:
        <input #username type="text">
      </label>
    </div>
    <div>
      <label> 
        パスワード:
        <input #password type="password">
      </label>
    </div>
    <div *ngIf="errorMessage">
      {{errorMessage}}
    </div>
    <div>
      <button (click)="login(username.value, password.value)">ログイン</button>
      <button (click)="checkLogin()">ログインチェック</button>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  errorMessage = "";

  constructor(
    private auth: AuthService, 
    private router: Router, 
  ) { }

  ngOnInit(): void {
  }

  async login(
    username: string, 
    password: string
  ) {
    try {
      await this.auth.login(
        username, password
      );

      this.router.navigate(['/']);
    } catch (err) {
      this.errorMessage = err instanceof Error ? err.message : '認証処理中にエラーが発生しました。';
    }
  }

  async checkLogin() {
    const result = await this.auth.isAutenticated();

    console.log(`結果:${result}`);
  }
}
