import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Imagen } from '../pages/imagen/imagen.model';
import { catchError, map, tap } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ImagenService {

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


  /** Get Imagenes */
  getAllImagenes(){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/imagen`, { headers: headers });
  }
  
  getImagenFileServer(imagen:string){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/imagen/getImgen/${imagen}`, { headers: headers });
  }
  
  obtenerImagenById(id:string){
    const headers = this.retornarHeader();
    console.log('HEADERS' , headers);
    return this.http.get(`${base_url}/imagen/${id}`, { headers: headers })
  } 
  
  obtenerImagenByPath(path:string){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/imagen/datos/${path}`, { headers: headers })
  }

  crearImagen(formData: any) {
    const headers = this.retornarHeader();
    return this.http.post(`${base_url}/imagen`, formData, { headers: headers });
  }

  updateImagen(id:string, imagen:Imagen){
    const headers = this.retornarHeader();
    return this.http.put(`${base_url}/imagen/${id}`, imagen, { headers: headers });
  }

  eliminarImagen( imagen:Imagen){
    const headers = this.retornarHeader();
    return this.http.delete(`${base_url}/imagen/${imagen._id}`, { headers: headers });
  }


  cargarImagenes (skip: number = 0){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/imagen?skip=${skip}`, { headers: headers })
    .pipe(
      tap( (resp:any) => {
        const Imagenes = resp.data.map((imagen:any) => new Imagen(imagen._id, imagen.nombre, imagen.email, imagen.estado, 'S/N')
        );
        return{
          total:resp.totalImagenes,
          Imagenes
        };
      })
    )
    
     
  }


}
