import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ImagenService } from 'src/app/services/imagen.service';
import { Imagen } from './imagen.model';

import Swal from 'sweetalert2';
import { Wso2Service } from 'src/app/services/wso2.service';
import { KeycloakAuthService } from 'src/app/auth/keycloak-auth.service';

@Component({
  selector: 'app-imagen',
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.css']
})
export class ImagenComponent implements OnInit {

  public imagenSeleccionada: any;
  public files: any = null;
  public files1: any = null;
  public files2: any = null;
  public nombreImagen: any = null;
  public nombreImagen2: any = null;

  ImagenModel = new Imagen();

  public editar: boolean = false;

  public usuario: any;

  constructor(
    private fb: FormBuilder,
    private imagenService: ImagenService,
    private wso2Service: Wso2Service,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private keycloakAuthService: KeycloakAuthService
  ) { }

  ngOnInit(): void {

    console.log('DATOS ENVIADOS', this.activatedRoute.snapshot.params);
    console.log('DATOS ENVIADOS', history.state.data);

    this.wso2Service.getToken().subscribe();

    this.cargarImagenbyId(history.state.data);

    this.usuario = this.keycloakAuthService.getLoggedUser();
    console.log('USUARIO: ',this.usuario.preferred_username);
  }

  async cargarImagenbyId(id: string) {
    if (id === 'nuevo' || id === undefined) {
      return;
    }
    this.editar = true;
    this.imagenService.obtenerImagenById(id)
      .subscribe((resp: any) => {
        console.log(resp);
        this.imagenSeleccionada = resp.data;
        this.LlenarForm(resp.data);
      });

  }
  public registerForm = this.fb.group({
    tipo: [null, Validators.required],
    descripcion: [null, Validators.required],
    estado: [null],
    imagen: [null],
    path: [null, Validators.required],
    nombreImagen: [null],
    fechasActualizacion: [null],
    _id:[null],
    usuario_creacion: [null],
    usuario_actualizacion: [null],
  })

  LlenarForm(resp: any) {
    const {
      tipo = '',
      descripcion = '',
      estado = '',
      path = ''
    } = resp;
    console.log(tipo);
    this.imagenSeleccionada = resp;
    this.registerForm.get('tipo')?.setValue(tipo);
    this.registerForm.get('descripcion')?.setValue(descripcion);
    this.registerForm.get('estado')?.setValue(estado);
    this.registerForm.get('path')?.setValue(path);
  }

  campoNoValido(campo: any): boolean {
    console.log(this.registerForm.get(campo)?.invalid);
    if (this.registerForm.get(campo)?.invalid && (this.registerForm.get(campo)?.dirty || this.registerForm.get(campo)?.touched)) {
      return true;
    }
    else {
      return false;
    }
  }

  crearCiudad() {

    if (this.imagenSeleccionada) {
      //actualizar
      this.ImagenModel = this.registerForm.value;
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

        //this.registerForm.value.imagen = this.files1;
        console.log('FILE 1: ' + this.files1);
        console.log('FILE 2: ' + this.files2);

        this.registerForm.value.fileBase64 = this.files1;
        this.registerForm.value.nombreImagen = this.nombreImagen;
        this.registerForm.value.imagen = this.imagenSeleccionada.imagen;
        this.registerForm.value.nombreImagen2 = this.nombreImagen2;
        this.registerForm.value.fileBase64_1 = this.files2;
        this.registerForm.value.imagenReducida = this.imagenSeleccionada.imagenReducida;
        this.registerForm.value._id = this.imagenSeleccionada._id;
        let fechas = this.imagenSeleccionada.fechasActualizacion;
        if (fechas === null) {
          fechas = [];
        }
        fechas.push(new Date());
        this.registerForm.value.fechasActualizacion = fechas;
        
        this.registerForm.value.usuario_creacion = this.imagenSeleccionada.usuario_creacion;
        this.registerForm.value.usuario_actualizacion = this.usuario.preferred_username;

        this.imagenService.updateImagen(this.imagenSeleccionada._id, this.registerForm.value).subscribe((resp: any) => {
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
          this.router.navigateByUrl('/imagenes');
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
            title: 'ERROR: ' + err.error.statusCode + '\nRecargue la página e intente nuevamente '
          })
        });



      }
    } else {
      //crear
      if (this.registerForm.invalid) {
        Swal.fire({
          title: 'Verificar campos invalidos \n Indicados con el color rojo',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }else{
        this.imagenService.obtenerImagenByPath(this.registerForm.value.path).subscribe((resp: any) => {
          console.log(resp);
          if (resp.data.length > 0) {
            console.log(resp, 'El path ya existe');
            //swal de confirmacion
            Swal.fire({
              title: 'El path ya existe',
              text: "¿Desea con el actual PATH?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Si, Aceptar!'
            }).then((result) => {
              if (result.isConfirmed) {
                resp.data.map((item: any) => {
                  item.estado = false;
                  this.imagenService.updateImagen(item._id, item).subscribe((resp: any) => {
                    console.log(resp);
                  });
                });
                this.registerForm.value.imagen = this.files1;
                this.registerForm.value.fileBase64 = this.files1;
                this.registerForm.value.fileBase64_1 = this.files2;
                this.registerForm.value.nombreImagen = this.nombreImagen;
                this.registerForm.value.nombreImagen2 = this.nombreImagen2;
                this.registerForm.value.usuario_creacion = this.usuario.preferred_username;
                console.log(this.registerForm.value);
                this.imagenService.crearImagen(this.registerForm.value).subscribe((resp: any) => {
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
                  this.router.navigateByUrl('/imagenes');
                }, (err: any) => { });
              }
  
            });
          } else {
  
            if (this.files1 == null || this.files2 == null) {
              Swal.fire(
                'Ingrese las imágenes',
                'Debe ingresar las dos imágenes para guardar los datos',
                'warning'
              )
            } else {
  
              this.registerForm.value.imagen = this.files1;
              this.registerForm.value.fileBase64 = this.files1;
              this.registerForm.value.fileBase64_1 = this.files2;
              this.registerForm.value.nombreImagen = this.nombreImagen;
              this.registerForm.value.nombreImagen2 = this.nombreImagen2;
              this.registerForm.value.usuario_creacion = this.usuario.preferred_username;
              console.log(this.registerForm.value);
              this.imagenService.crearImagen(this.registerForm.value).subscribe((resp: any) => {
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
                this.router.navigateByUrl('/imagenes');
              }, (err: any) => { });
            }
          }
        });
      }
      


    }


  }

  cancelarGuardado() {
    this.router.navigateByUrl('/imagenes')
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
    this.files = null;
  }

  onSelectReducida(event: any) {
    let imgTemp: any;
    this.files2 = [event.addedFiles[0]];
    this.nombreImagen2 = event.addedFiles[0].name;
    const reader = new FileReader();
    const url64 = reader.readAsDataURL(event.addedFiles[0]);
    reader.onloadend = () => {
      imgTemp = reader.result;
      this.files2 = imgTemp.split(',')[1];
      console.log(this.files2);
    }
  }

  onRemoveReducida(event: any) {
    this.files2 = null;
  }

}
