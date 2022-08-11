import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatareaComponent } from './chatarea/chatarea.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: '',
    component: ChatareaComponent,
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
