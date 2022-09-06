import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', 
    component: MainComponent, 
    canActivate: [ AuthGuard ]
   }, 
  { path: 'login', component: LoginComponent }, 
  { path: 'user-registration', component: UserRegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
