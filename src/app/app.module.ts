import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { ResgisterComponent } from './auth/resgister/resgister.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BreadcrumbsComponent } from './share/breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './share/sidebar/sidebar.component';
import { HeaderComponent } from './share/header/header.component';
import { PagesComponent } from './pages/pages.component';
import { ImagenComponent } from './pages/imagen/imagen.component';

import {HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ImagenesComponent } from './pages/imagen/imagenes/imagenes.component';
import { ImagenPipe } from './pipe/imagen.pipe';
import { FuncionarioComponent } from './pages/funcionario/funcionario.component';
import { FuncionariosComponent } from './pages/funcionario/funcionarios/funcionarios.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { KeycloakGuard } from './auth/keycloak-auth.guard';
import { KeycloakAuthService } from './auth/keycloak-auth.service';
import { initializeKeycloak } from './auth/keycloack-init';

//Keycloack
/*import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializeKeycloak } from './modules/auth/keycloack/keycloack-init';
import { KeycloakGuard } from './core/helpers/keycloak-auth.guard';
import { KeycloakAuthService } from './core/helpers/keycloak-auth.service';*/


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResgisterComponent,
    NopagefoundComponent,
    DashboardComponent,
    BreadcrumbsComponent,
    SidebarComponent,
    HeaderComponent,
    PagesComponent,
    ImagenComponent,
    ImagenesComponent,
    ImagenPipe,
    FuncionarioComponent,
    FuncionariosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDropzoneModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    KeycloakGuard,
    KeycloakAuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
