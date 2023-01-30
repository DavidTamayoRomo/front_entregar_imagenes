import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Funcionario } from '../pages/funcionario/funcionario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  constructor(private http:HttpClient) { }


  retornarHeader(){
    const token = localStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return headers;
  }


  /** Get funcionarios */
  getAllFuncionarios(){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/funcionario`, { headers: headers });
  }
  
  crearFuncionario(formData: any) {
    const headers = this.retornarHeader();
    return this.http.post(`${base_url}/funcionario`, formData, { headers: headers });
  }

  obtenerFuncionarioById(id:string){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/funcionario/${id}`, { headers: headers })
  }

  updateFuncionario(id:string, funcionario:Funcionario){
    const headers = this.retornarHeader();
    return this.http.put(`${base_url}/funcionario/${id}`, funcionario, { headers: headers });
  }

  eliminarFuncionario( funcionario:Funcionario){
    const headers = this.retornarHeader();
    return this.http.delete(`${base_url}/funcionario/${funcionario._id}`, { headers: headers });
  }


  cargarFuncionarios (skip: number = 0){
    const headers = this.retornarHeader();
    return this.http.get(`${base_url}/funcionario?skip=${skip}`, { headers: headers })
    .pipe(
      tap( (resp:any) => {
        const funcionarios = resp.data.map((funcionario:any) => new Funcionario(funcionario._id, funcionario.cargo, funcionario.nombres, funcionario.apellidos
          , funcionario.foto, funcionario.titulo, funcionario.descripcion
          , funcionario.fechaNacimiento, funcionario.redesSociales, funcionario.estado)
        );
        return{
          total:resp.totalfuncionarios,
          funcionarios
        };
      })
    )  
  }

}
