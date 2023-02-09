import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImagenService } from 'src/app/services/imagen.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Wso2Service } from 'src/app/services/wso2.service';
import { environment } from 'src/environments/environment';

import Swal from 'sweetalert2';
import { Imagen } from '../imagen.model';

const base_url = environment.base_url;
const url = environment.url;

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.css']
})
export class ImagenesComponent implements OnInit {

  public cargando: boolean = false;
  public imagenes: any[] = [];
  public totalImagenes: number = 0;
  public desde: number = 0;
  public imagenes1: Imagen[] = [];
  public imagenesTemporales: Imagen[] = [];
  public actualizarImagenes:any[] = [];
  public botonActualizar:boolean = false;

  constructor(
    private imagenService: ImagenService,
    private wso2Service: Wso2Service,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wso2Service.getToken().subscribe();
    this.cargarImagenes();
  }


  cargarImagenes() {
    this.cargando = true;
    this.imagenService.cargarImagenes(this.desde).subscribe((resp: any) => {
      console.log(resp);
      this.cargando = false;
      this.imagenes = resp.data;
      this.imagenes1 = resp.data;
      this.imagenesTemporales = resp.data;
      this.totalImagenes = resp.totalImagenes;
    });
  }

  paginar(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;

    } else if (this.desde > this.totalImagenes) {
      this.desde -= valor;
    }
    this.cargarImagenes();
  }

  buscar(busqueda: any) {
    if (busqueda.length === 0) {
      this.imagenes = this.imagenesTemporales;
    }
    this.utilsService.busqueda('imagen', busqueda).subscribe(
      (resp: any) => {
        console.log(resp);
        this.imagenes = resp.data;
      }
    );
  }


  borrarImagen(Imagen: any) {

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



  async actualizarEstado(imagen: any) {
    if (imagen.estado) {
      imagen.estado = false;
    } else {
      imagen.estado = true;
    }
    //obtener datos de fechasActualizacion
    let fechas = imagen.fechasActualizacion;
    console.log('FECHAS: ', fechas);
    if (fechas === null) {
      fechas = [];
    }
    fechas.push(new Date());
    imagen.fechasActualizacion = fechas;

    this.imagenService.updateImagen(imagen._id, imagen).subscribe(resp => {
      console.log(resp);
      Swal.fire(
        'Actualizado!',
        `Imagen actualizada con éxito.`,
        'success'
      );
      this.cargarImagenes();
    });
  }

  crearLinkImagen(imagen: any) {
    try {
      let url = `${base_url}/imagen/devolverImagen/secretaria/${imagen.path}`;
      navigator.clipboard.writeText(url);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Copiado correctamente',
        showConfirmButton: false,
        timer: 900
      })
    } catch (error) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo copiar correctamente',
        showConfirmButton: false,
        timer: 900
      })
    }


  }

  editar(imagen: any) {
    //this.router.navigate(['/imagen/',imagen._id]);
    //this.router.navigate(['/imagen'], { state: {data: imagen._id} });
    document.location.href = `${url}/imagen/${imagen._id}`;
  }

  async seleccionar(imagen: any) {
    this.botonActualizar = true;
    if(this.actualizarImagenes.length == 0){
      this.actualizarImagenes.push(imagen._id);
    }else{
      const found = await this.actualizarImagenes.find(element => element === imagen._id);
      if(found){
        this.actualizarImagenes = this.actualizarImagenes.filter((element) => element !== imagen._id);
        if(this.actualizarImagenes.length == 0) this.botonActualizar = false;
      }else{
        this.actualizarImagenes.push(imagen._id);
      }
    }
  }

  actualizar(valor:boolean){
    //swal de confirmacion
    Swal.fire({
      title: 'Desea actualizar las imagenes ?',
      text: `Esta a punto de actualizar las imagenes seleccionadas`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar las imagenes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarImagenes.map((element) => {
          this.imagenService.obtenerImagenById(element).subscribe((resp:any) => {
            resp.data.estado = valor;
            this.imagenService.updateImagen(resp.data._id, resp.data).subscribe(resp => {
              this.actualizarImagenes = this.actualizarImagenes.filter((element1) => element1 !== element);
              if(this.actualizarImagenes.length == 0) this.botonActualizar = false;
              Swal.fire(
                'Actualizado!',
                `Imagenes actualizada con éxito.`,
                'success'
              );
              this.cargarImagenes();
            });
          });
        });
      }
    });


    
  }

}
