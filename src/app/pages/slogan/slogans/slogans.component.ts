import { Component, OnInit } from '@angular/core';
import { SloganService } from 'src/app/services/slogan.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Wso2Service } from 'src/app/services/wso2.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Slogan } from '../slogan.model';

const base_url = environment.base_url;

@Component({
  selector: 'app-slogans',
  templateUrl: './slogans.component.html',
  styleUrls: ['./slogans.component.css']
})
export class SlogansComponent implements OnInit {

  public cargando: boolean = false;
  public slogans: any[] = [];
  public totalslogans: number = 0;
  public desde: number = 0;
  public slogans1: Slogan[] = [];
  public slogansTemporales: Slogan[] = [];

  public actualizarImagenes: any[] = [];
  public botonActualizar: boolean = false;
  public parametros: any[] = ['Activos', 'Inactivos'];

  public activo: boolean = true;
  public inactivo: boolean = true;

  constructor(
    private sloganService: SloganService,
    private wso2Service: Wso2Service,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.cargarSlogans(true, true);
    this.wso2Service.getToken().subscribe();
  }

  cargarSlogans(activo: boolean, inactivo: boolean) {
    this.cargando = true;
    this.sloganService.cargarSlogans(this.desde, activo, inactivo).subscribe((resp: any) => {
      console.log(resp);
      this.cargando = false;
      this.slogans = resp.data;
      this.slogans1 = resp.data;
      this.slogansTemporales = resp.data;
      this.totalslogans = resp.totalslogans;
    });
  }

  paginar(valor: number) {
    this.desde += valor;

    if (this.desde < 0) {
      this.desde = 0;

    } else if (this.desde > this.totalslogans) {
      this.desde -= valor;
    }
    this.cargarSlogans(this.activo, this.inactivo);
  }

  buscar(busqueda: any) {

    if (busqueda.length === 0) {
      this.slogans = this.slogansTemporales;
    }
    this.utilsService.busqueda('slogan', busqueda).subscribe(
      (resp: any) => {
        console.log(resp);
        this.slogans = resp.data;
      }
    );
  }

  borrarSlogan(slogan: any) {

    Swal.fire({
      title: 'Desea eliminar la slogan ?',
      text: `Esta a punto de borrar a ${slogan.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar esta slogan'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sloganService.eliminarSlogan(slogan).subscribe(resp => {
          this.cargarSlogans(this.activo, this.inactivo);
          Swal.fire(
            'Borrado!',
            `A sido eliminada con éxito.`,
            'success'
          )
        });

      }
    })
  }


  actualizarEstado(slogan: any) {
    if (slogan.estado) {
      slogan.estado = false;
    } else {
      slogan.estado = true;
    }
    this.sloganService.updateSlogan(slogan._id, slogan).subscribe(resp => {
      console.log(resp);
      Swal.fire(
        'Actualizado!',
        `slogan actualizada con éxito.`,
        'success'
      )
    });
  }


  crearLink(slogan: any) {
    let url = `${base_url}/slogan/finbyCargo/${slogan.path}`;
    navigator.clipboard.writeText(url);
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Copiado correctamente',
      showConfirmButton: false,
      timer: 900
    })

  }

  copiarImagen(slogan: any) {
    let url = `${base_url}/slogan/devolverImagen/${slogan.path}`;
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
      title: 'Desea actualizar los slogans seleccionados ?',
      text: `Esta a punto de actualizar los slogans seleccionadas`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, actualizar los slogans'
    }).then((result) => {
      if (result.isConfirmed) {
        this.actualizarImagenes.map((element) => {
          this.sloganService.obtenerSloganById(element).subscribe((resp: any) => {
            resp.data.estado = valor;
            this.sloganService.updateSlogan(resp.data._id, resp.data).subscribe(resp => {
              this.actualizarImagenes = this.actualizarImagenes.filter((element1) => element1 !== element);
              if (this.actualizarImagenes.length == 0) this.botonActualizar = false;
              Swal.fire(
                'Actualizado!',
                `slogans actualizados con éxito.`,
                'success'
              );
              this.cargarSlogans(this.activo, this.inactivo);
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

    this.cargarSlogans(this.activo, this.inactivo);
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




}
