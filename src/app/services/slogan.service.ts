import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Slogan } from '../pages/slogan/slogan.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class SloganService {

  constructor(private http:HttpClient) { }


  retornarHeader(){
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'token1': `${token}`
    });
    return headers;
  }


  /** Get Slogans */
  getAllSlogans(){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/slogan`, { headers: headers });
  }
  
  crearSlogan(formData: any) {
    const headers = this.retornarHeader();
    return this.http.post(`${base_url}/slogan`, formData, { headers: headers });
  }

  obtenerSloganById(id:string){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/slogan/${id}`, { headers: headers })
  }

  updateSlogan(id:string, slogan:Slogan){
    const headers = this.retornarHeader();
    return this.http.put(`${base_url}/slogan/${id}`, slogan, { headers: headers });
  }

  eliminarSlogan( slogan:Slogan){
    const headers = this.retornarHeader();
    return this.http.delete(`${base_url}/slogan/${slogan._id}`, { headers: headers });
  }


  cargarSlogans (skip: number = 0, activo:any, inactivo:any){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/slogan?skip=${skip}&activo=${activo}&inactivo=${inactivo}`, { headers: headers })
    .pipe(
      tap( (resp:any) => {
        const slogans = resp.data.map((slogan:any) => new Slogan(slogan._id, slogan.imagen, slogan.titulo, slogan.descripcion, slogan.path, slogan.estado)
        );
        return{
          total:resp.totalSlogans,
          slogans
        };
      })
    )  
  }
}
