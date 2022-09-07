import { NgModule, ɵɵsetComponentScope } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { JwtModule } from '@auth0/angular-jwt';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    UserRegistrationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule, 
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          const token = localStorage.getItem("auth_tkn");
          console.log(`トークン:${token}`);
          return token;
        }, 
        //`http://localhost:3000`と指定したら、httpClientを用いてのリクエスト時、上記tokenGetterを通らなかった。
        allowedDomains: ['localhost:3000']
      }
    })
  ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
