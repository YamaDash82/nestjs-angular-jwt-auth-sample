import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-registration',
  template: `
    <div>
      <label>
        ユーザー名:<input type="text" #userName>
      </label>
    </div>
    <div>
      <label>
        パスワード:<input type="password" #password1>
      </label>
    </div>
    <div>
      <label>
        パスワード再入力:<input type="password" #password2>
      </label>
    </div>
    <div *ngIf="errorMessage">
      {{errorMessage}}
    </div>
    <div>
      <button
        (click)="registerUser(userName.value, password1.value, password2.value)"
      >登録</button>
    </div>
  `,
  styleUrls: ['./user-registration.component.css']
})
export class UserRegistrationComponent implements OnInit {
  errorMessage = "";

  constructor(
    private auth: AuthService, 
    private router: Router, 
  ) { }

  ngOnInit(): void {
  }

  async registerUser(
    username: string, 
    pass1: string, 
    pass2: string
  ) {
    if(!username) {
      this.errorMessage = "ユーザー名を入力してください。";
      return;
    }

    if(!pass1) {
      this.errorMessage = "パスワードを入力してください。";
      return;
    }

    if(!pass2) {
      this.errorMessage = "パスワード再入力を入力してください。";
      return;
    }

    if (pass1 !== pass2) {
      this.errorMessage = "パスワードとパスワード再入力が一致しません。";
      return;
    }

    try {
      const result = await this.auth.registerUser(username, pass1);

      if (result) {
        this.router.navigate(['/']);
      }
    } catch (err) {
      this.errorMessage = err instanceof Error ? err.message : 'ユーザー登録処理でエラーが発生しました。';
    }
  }
}
