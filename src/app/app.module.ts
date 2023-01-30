import { NgModule } from '@angular/core';
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
    NgxDropzoneModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
