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

  public actualizarImagenes: any[] = [];
  public botonActualizar: boolean = false;
  public parametros: any[] = ['Activos', 'Inactivos'];

  public activo: boolean = true;
  public inactivo: boolean = true;

  constructor(
    private funcionarioService:FuncionarioService,
    private wso2Service:Wso2Service,
    private utilsService:UtilsService,
    ) { }

  ngOnInit(): void {
    this.cargarfuncionarios(true, true);
    this.wso2Service.getToken().subscribe();
  }

  cargarfuncionarios(activo:boolean, inactivo:boolean){
    this.cargando=true;
    this.funcionarioService.cargarFuncionarios(this.desde, activo, inactivo).subscribe((resp:any)=>{
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
    this.cargarfuncionarios(this.activo, this.inactivo);
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
          this.cargarfuncionarios(this.activo, this.inactivo);
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



  actualizar(valor: boolean) {
    //swal de confirmacion
    Swal.fire({
      title: 'Desea actualizar los funcionarios seleccionados ?',
      text: `Esta a punto de actualizar los funcionarios seleccionadas`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar los funcionarios'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarImagenes.map((element) => {
          this.funcionarioService.obtenerFuncionarioById(element).subscribe((resp: any) => {
            resp.data.estado = valor;
            this.funcionarioService.updateFuncionario(resp.data._id, resp.data).subscribe(resp => {
              this.actualizarImagenes = this.actualizarImagenes.filter((element1) => element1 !== element);
              if (this.actualizarImagenes.length == 0) this.botonActualizar = false;
              Swal.fire(
                'Actualizado!',
                `Funcionarios actualizados con éxito.`,
                'success'
              );
              this.cargarfuncionarios(this.activo, this.inactivo);
            });
          });
        });
      }
    });



  }


  async parametroBusqueda(valor: any) {
    this.actualizarImagenes = [];
    this.botonActualizar = false;
    
    this.activo = false;
    this.inactivo = false;

    const found = await this.parametros.find(element => element === valor);
    if (found) {
      this.parametros = this.parametros.filter((element) => element !== valor);
    } else {
      this.parametros.push(valor);
    }

    const activo = await this.parametros.find(element => element === 'Activos');
    const inactivo = await this.parametros.find(element => element === 'Inactivos');
    if (activo) this.activo = true;
    if (inactivo) this.inactivo = true;
    console.log('Parametros: ', this.parametros);
    console.log('Activo: ', this.activo);
    console.log('Inactivo: ', this.inactivo);

    this.cargarfuncionarios(this.activo, this.inactivo);
  }

  async seleccionar(imagen: any) {
    this.botonActualizar = true;
    if (this.actualizarImagenes.length == 0) {
      this.actualizarImagenes.push(imagen._id);
    } else {
      const found = await this.actualizarImagenes.find(element => element === imagen._id);
      if (found) {
        this.actualizarImagenes = this.actualizarImagenes.filter((element) => element !== imagen._id);
        if (this.actualizarImagenes.length == 0) this.botonActualizar = false;
      } else {
        this.actualizarImagenes.push(imagen._id);
      }
    }
  }


  eliminarPermanente(){
    Swal.fire({
      title: 'Desea eliminar de forma permanente los funcionarios seleccionadas?',
      text: `Esta a punto de eliminar los funcionarios seleccionados`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, elimanar los funcionarios de forma permanente'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarImagenes.map((element) => {
          console.log('Elemento a eliminar: ',element);
          this.funcionarioService.obtenerFuncionarioById(element).subscribe((resp: any) => {
            this.funcionarioService.eliminarFuncionario(resp.data).subscribe((resp: any) => {
              this.cargarfuncionarios(this.activo, this.inactivo);
              Swal.fire(
                'Eliminado',
                `Funcionarios eliminados con éxito.`,
                'success'
              );
            });
          });
        });
      }
    });
  }

}
