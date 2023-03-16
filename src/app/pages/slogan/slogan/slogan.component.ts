import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SloganService } from 'src/app/services/slogan.service';
import { Wso2Service } from 'src/app/services/wso2.service';
import Swal from 'sweetalert2';
import { Slogan } from '../slogan.model';

@Component({
  selector: 'app-slogan',
  templateUrl: './slogan.component.html',
  styleUrls: ['./slogan.component.css']
})
export class SloganComponent implements OnInit {

  public sloganSeleccionada: any;
  public files: any = null;
  public files1: any = null;
  public nombreImagen: any = null;

  SloganModel = new Slogan();

  constructor(
    private fb: FormBuilder,
    private sloganService: SloganService,
    private wso2Service: Wso2Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wso2Service.getToken().subscribe();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarSloganbyId(id);
    });
  }

  async cargarSloganbyId(id: string) {
    if (id === 'nuevo') {
      return;
    }
    this.sloganService.obtenerSloganById(id)
      .subscribe((resp: any) => {
        console.log(resp);
        this.sloganSeleccionada = resp.data;
        this.LlenarForm(resp.data);
      });
  }

  public registerForm = this.fb.group({
    imagen: [null],
    titulo: [null],
    descripcion: [null],
    path: [null],
    estado: [null],
  })


  LlenarForm(resp: any) {
    const {
      imagen,
      titulo,
      descripcion,
      path,
      estado
    } = resp;
    this.sloganSeleccionada = resp;
    this.registerForm.patchValue({
      imagen,
      titulo,
      descripcion,
      path,
      estado
    });
  }


  campoNoValido(campo: any): boolean {
    if (this.registerForm.get(campo)?.invalid && (this.registerForm.get(campo)?.dirty || this.registerForm.get(campo)?.touched)) {
      return true;
    }
    else {
      return false;
    }
  }

  crearSlogan() {

    if (this.sloganSeleccionada) {
      //actualizar
      this.SloganModel = this.registerForm.value;
      if (this.registerForm.invalid) {
        //Formulario invalido
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'error',
          title: 'Verificar campos invalidos \n Indicados con el color rojo'
        })
        return;
      } else {

        this.registerForm.value.fileBase64 = this.files1;
        this.registerForm.value.nombreImagen = this.nombreImagen;//nombre de la imagen

        this.sloganService.updateSlogan(this.sloganSeleccionada._id, this.registerForm.value).subscribe(() => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: 'Se actualizo correctamente'
          })
          this.router.navigateByUrl('/slogans');
        }, (err: any) => {

          console.warn(err.error.message);

          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          })

          //TODO: Mostrar error cuando es administrador. Dato que muestra el error completo=  err.error.message
          Toast.fire({
            icon: 'error',
            title: 'ERROR: ' + err.error.statusCode + '\n Recargue la página e intente nuevamente '
          })
        });
      }
    } else {
      //crear

      this.registerForm.value.fileBase64 = this.files1;
      this.registerForm.value.nombreImagen = this.nombreImagen;//nombre de la imagen
      console.log(this.registerForm.value);
      this.sloganService.crearSlogan(this.registerForm.value).subscribe((resp: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })
        Toast.fire({
          icon: 'success',
          title: 'Se creo correctamente'
        })
        console.log(resp);
        this.router.navigateByUrl('/slogans');
      }, (err: any) => { });
    }


  }

  cancelarGuardado() {
    this.router.navigateByUrl('/slogans');
  }

  onSelect(event: any) {
    let imgTemp: any;
    this.files = [event.addedFiles[0]];
    this.nombreImagen = event.addedFiles[0].name;
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(event.addedFiles[0]);
    reader.onloadend = () => {
      imgTemp = reader.result;
      this.files1 = imgTemp.split(',')[1];
      console.log(this.files1);
    }
  }

  onRemove(event: any) {
    this.files = [];
  }


}
