import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div>
      <label>
        ユーザー名:
        <input #username type="text">
      </label>
    </div>
    <div>
      <label> 
        パスワード:
        <input #password type="password">
      </label>
    </div>
    <a routerLink="/user-registration">新規ユーザー登録</a>
    <div *ngIf="errorMessage" class="error-message">
      {{errorMessage}}
    </div>
    <div class="button-container">
      <button (click)="login(username.value, password.value)">ログイン</button>
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
