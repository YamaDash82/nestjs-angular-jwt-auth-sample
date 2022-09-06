import { Component, OnInit } from '@angular/core';
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
    <div>
      <button (click)="login(username.value, password.value)">ログイン</button>
      <button (click)="checkLogin()">ログインチェック</button>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  login(
    username: string, 
    password: string
  ) {
    try {
      this.auth.login(
        username, password
      );
    } catch (err) {
      console.log(`エラー:${err instanceof Error ? err.message : ''}`);
    }
    
  }

  async checkLogin() {
    const result = await this.auth.isAutenticated();

    console.log(`結果:${result}`);
  }
}
