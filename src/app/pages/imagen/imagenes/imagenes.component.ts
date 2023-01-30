import { Component, OnInit } from '@angular/core';
import { ImagenService } from 'src/app/services/imagen.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import { Imagen } from '../imagen.model';

const base_url = environment.base_url;

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.css']
})
export class ImagenesComponent implements OnInit {

  public cargando:boolean=false;
  public imagenes:any [] = [];
  public totalImagenes:number=0;
  public desde:number = 0;
  public imagenes1:Imagen [] = [];
  public imagenesTemporales:Imagen [] = [];

  constructor(
    private imagenService:ImagenService
    ) { }

  ngOnInit(): void {
    this.cargarImagenes();
  }

  cargarImagenes(){
    this.cargando=true;
    this.imagenService.cargarImagenes(this.desde).subscribe((resp:any)=>{
      console.log(resp);
      this.cargando=false;
      this.imagenes = resp.data;
      this.imagenes1 = resp.data;
      this.imagenesTemporales = resp.data;
      this.totalImagenes = resp.totalImagenes;
    });
  }

  paginar(valor:number){
    this.desde += valor;

    if (this.desde<0) {
      this.desde = 0;
      
    }else if(this.desde> this.totalImagenes){
      this.desde -= valor;  
    }
    this.cargarImagenes();
  }

  buscar(busqueda:any){
    if (busqueda.length === 0) {
      return this.imagenes = this.imagenesTemporales;
    }
    return null;
  }


  borrarImagen(Imagen:any){
    
    Swal.fire({
      title: 'Desea eliminar la Imagen ?',
      text: `Esta a punto de borrar a ${Imagen.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar esta Imagen'
    }).then((result) => {
      if (result.isConfirmed) {
        this.imagenService.eliminarImagen(Imagen).subscribe(resp => {
          this.cargarImagenes();
          Swal.fire(
            'Borrado!',
            `${Imagen.nombre} a sido eliminada con éxito.`,
            'success'
          )
        });
        
      }
    })
  }


  
  async actualizarEstado(imagen:any){
    if (imagen.estado) {
      imagen.estado = false;
    }else{
      imagen.estado = true;
    }
    //obtener datos de fechasActualizacion
    let fechas = imagen.fechasActualizacion;
    console.log('FECHAS: ',fechas);
    if (fechas === null) {
      fechas = [];
    }
    fechas.push(new Date());
    imagen.fechasActualizacion = fechas;

    this.imagenService.updateImagen(imagen._id,imagen).subscribe(resp=>{
      console.log(resp);
      Swal.fire(
        'Actualizado!',
        `Imagen actualizada con éxito.`,
        'success'
      );
      this.cargarImagenes();
    }); 
  }

  crearLinkImagen(imagen:any){
    let url = `${base_url}/imagen/devolverImagen/secretaria/${imagen.path}`;
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
