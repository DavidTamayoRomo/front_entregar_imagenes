import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { ResgisterComponent } from './auth/resgister/resgister.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { PagesComponent } from './pages/pages.component';
import { ImagenComponent } from './pages/imagen/imagen.component';
import { ImagenesComponent } from './pages/imagen/imagenes/imagenes.component';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { FuncionariosComponent } from './pages/funcionario/funcionarios/funcionarios.component';
import { KeycloakGuard } from './auth/keycloak-auth.guard';

const routes: Routes = [
  /**Rutas protegidas */
 
  {
    path:'', 
    component:PagesComponent,
    canActivate: [KeycloakGuard],
    children:[
      /**Rutas que necesitan autenticacion */
      {path:'dashboard', component:DashboardComponent},

      {path:'imagen', component:ImagenComponent},
      {path:'imagenes', component:ImagenesComponent},
      
      {path:'funcionario/:id', component:FuncionarioComponent},
      {path:'funcionarios', component:FuncionariosComponent},

      {path:'', redirectTo:'/dashboard', pathMatch:'full'},
    ]
  },
  
  /**Rutas publicas */
  {path:'login', component:LoginComponent},

  /**Redirecciones */
  {path:'**', component: NopagefoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
