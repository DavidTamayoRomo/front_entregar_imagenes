import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http:HttpClient) { }


  retornarHeader(){
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }


  busqueda(tabla:string, busqueda:string){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/busqueda/busquedaespecifica/${tabla}/${busqueda}`, { headers: headers });
  }
}
