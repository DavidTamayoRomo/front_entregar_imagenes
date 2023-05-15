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
  public actualizarImagenes: any[] = [];
  public botonActualizar: boolean = false;
  public parametros: any[] = ['Activos', 'Inactivos'];
  public mostraModal: boolean = true;

  public activo: boolean = true;
  public inactivo: boolean = true;

  constructor(
    private imagenService: ImagenService,
    private wso2Service: Wso2Service,
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wso2Service.getToken().subscribe();
    this.cargarImagenes(true, true);
  }


  cargarImagenes(activo: boolean, inactivo: boolean) {
    this.cargando = true;
    this.imagenService.cargarImagenes(this.desde, activo, inactivo).subscribe((resp: any) => {
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
    this.cargarImagenes(this.activo, this.inactivo);
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
    console.log(Imagen);
    Swal.fire({
      title: 'Desea eliminar la Imagen ?',
      text: `Esta a punto de borrar a ${Imagen.path}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar esta Imagen'
    }).then((result) => {
      if (result.isConfirmed) {
        this.imagenService.eliminarImagen(Imagen).subscribe(resp => {
          this.cargarImagenes(this.activo, this.inactivo);
          Swal.fire(
            'Borrado!',
            `${Imagen.path} a sido eliminada con éxito.`,
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
      this.cargarImagenes(this.activo, this.inactivo);
    });
  }

  crearLinkImagen(imagen: any) {
    try {
      console.log('Base URL:', base_url)
      let url = `${base_url}/imagen/devolverImagen/secretaria/${imagen.path}`;
      console.log('Error URL:', url);
      navigator.clipboard.writeText(url);
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Copiado correctamente',
        showConfirmButton: false,
        timer: 900
      })
    } catch (error) {
      console.log('Error Copiado:', error);
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
    this.router.navigate(['/imagen'], { state: { data: imagen._id } });
    //document.location.href = `${url}/imagen/${imagen._id}`;
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

  actualizar(valor: boolean) {
    Swal.fire({
      title: 'Desea actualizar las imágenes ?',
      text: `Esta a punto de actualizar las imágenes seleccionadas`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar las imágenes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarImagenes.map((element) => {
          this.imagenService.obtenerImagenById(element).subscribe((resp: any) => {
            resp.data.estado = valor;
            this.imagenService.updateImagen(resp.data._id, resp.data).subscribe(resp => {
              this.actualizarImagenes = this.actualizarImagenes.filter((element1) => element1 !== element);
              if (this.actualizarImagenes.length == 0) this.botonActualizar = false;
              Swal.fire(
                'Actualizado!',
                `Imágenes actualizadas con éxito.`,
                'success'
              );
              this.cargarImagenes(this.activo, this.inactivo);
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

    this.cargarImagenes(this.activo, this.inactivo);
  }


  eliminarPermanente(){
    Swal.fire({
      title: 'Desea eliminar de forma permanente las imágenes seleccionadas?',
      text: `Esta a punto de eliminar las imágenes seleccionadas`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar las imágenes de forma permanente'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarImagenes.map((element) => {
          console.log('Elemento a eliminar: ',element);
          this.imagenService.obtenerImagenById(element).subscribe((resp: any) => {
            this.imagenService.eliminarImagen(resp.data).subscribe((resp: any) => {
              this.cargarImagenes(this.activo, this.inactivo);
              Swal.fire(
                'Eliminado',
                `Imágenes eliminadas con éxito.`,
                'success'
              );
            });
          });
        });
      }
    });
  }



  cerrarModal() {
    this.mostraModal = true;
  }

  mostrarDatosModal(cita: any) {
    this.mostraModal = false;


  }

  imageObject: Array<object> = [/* {
    image: 'assets/img/slider/1.jpg',
    thumbImage: 'assets/img/slider/1_min.jpeg',
    alt: 'alt of image',
    title: 'title of image'
  }, {
    image: '.../iOe/xHHf4nf8AE75h3j1x64ZmZ//Z==', // Support base64 image
    thumbImage: '.../iOe/xHHf4nf8AE75h3j1x64ZmZ//Z==', // Support base64 image
    title: 'Image title', //Optional: You can use this key if want to show image with title
    alt: 'Image alt', //Optional: You can use this key if want to show image with alt
    order: 1 //Optional: if you pass this key then slider images will be arrange according @input: slideOrderType
  } */
  ];

}


