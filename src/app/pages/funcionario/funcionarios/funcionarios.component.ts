import { Component, OnInit } from '@angular/core';

import { FuncionarioService } from 'src/app/services/funcionario.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Wso2Service } from 'src/app/services/wso2.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Funcionario } from '../funcionario.model';


const base_url = environment.base_url;

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent implements OnInit {

  public cargando:boolean=false;
  public funcionarios:any [] = [];
  public totalfuncionarios:number=0;
  public desde:number = 0;
  public funcionarios1:Funcionario [] = [];
  public funcionariosTemporales:Funcionario [] = [];

  constructor(
    private funcionarioService:FuncionarioService,
    private wso2Service:Wso2Service,
    private utilsService:UtilsService,
    ) { }

  ngOnInit(): void {
    this.cargarfuncionarios();
    this.wso2Service.getToken().subscribe();
  }

  cargarfuncionarios(){
    this.cargando=true;
    this.funcionarioService.cargarFuncionarios(this.desde).subscribe((resp:any)=>{
      console.log(resp);
      this.cargando=false;
      this.funcionarios = resp.data;
      this.funcionarios1 = resp.data;
      this.funcionariosTemporales = resp.data;
      this.totalfuncionarios = resp.totalfuncionarios;
    });
  }

  paginar(valor:number){
    this.desde += valor;

    if (this.desde<0) {
      this.desde = 0;
      
    }else if(this.desde> this.totalfuncionarios){
      this.desde -= valor;  
    }
    this.cargarfuncionarios();
  }

  buscar(busqueda:any){

    if (busqueda.length === 0) {
      this.funcionarios = this.funcionariosTemporales;
    }
    this.utilsService.busqueda('funcionario',busqueda).subscribe(
      (resp:any)=>{
        console.log(resp);
        this.funcionarios = resp.data;
      }
    );
  }


  borrarfuncionario(funcionario:any){
    
    Swal.fire({
      title: 'Desea eliminar la funcionario ?',
      text: `Esta a punto de borrar a ${funcionario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar esta funcionario'
    }).then((result) => {
      if (result.isConfirmed) {
        this.funcionarioService.eliminarFuncionario(funcionario).subscribe(resp => {
          this.cargarfuncionarios();
          Swal.fire(
            'Borrado!',
            `A sido eliminada con éxito.`,
            'success'
          )
        });
        
      }
    })
  }


  
  actualizarEstado(funcionario:any){
    if (funcionario.estado) {
      funcionario.estado = false;
    }else{
      funcionario.estado = true;
    }
    this.funcionarioService.updateFuncionario(funcionario._id,funcionario).subscribe(resp=>{
      console.log(resp);
      Swal.fire(
        'Actualizado!',
        `funcionario actualizada con éxito.`,
        'success'
      )
    });
  }


  crearLink(funcionario:any){
    let url = `${base_url}/funcionario/finbyCargo/${funcionario.cargo}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Copiado correctamente',
      showConfirmButton: false,
      timer: 900
    })
    
  }

  copiarImagen(funcionario:any){
    let url = `${base_url}/funcionario/devolverImagen/${funcionario.cargo}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Copiado correctamente',
      showConfirmButton: false,
      timer: 900
    })
  }

}
