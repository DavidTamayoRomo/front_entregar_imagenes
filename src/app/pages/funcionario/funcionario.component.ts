import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuncionarioService } from 'src/app/services/funcionario.service';
import { Wso2Service } from 'src/app/services/wso2.service';
import Swal from 'sweetalert2';
import { Funcionario } from './funcionario.model';


@Component({
  selector: 'app-funcionario',
  templateUrl: './funcionario.component.html',
  styleUrls: ['./funcionario.component.css']
})
export class FuncionarioComponent implements OnInit {

  public funcionarioSeleccionada: any;
  public files: any = null;
  public files1: any = null;
  public nombreImagen: any = null;

  FuncionarioModel = new Funcionario();

  constructor(
    private fb: FormBuilder,
    private funcionarioService: FuncionarioService,
    private wso2Service: Wso2Service,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.wso2Service.getToken().subscribe();
    this.activatedRoute.params.subscribe(({ id }) => {
      this.cargarFuncionariobyId(id);
    });
  }

  async cargarFuncionariobyId(id: string) {
    if (id === 'nuevo') {
      return;
    }

    this.funcionarioService.obtenerFuncionarioById(id)
      .subscribe((resp: any) => {
        console.log(resp);
        this.funcionarioSeleccionada = resp.data;
        this.LlenarForm(resp.data);
      });

  }
  public registerForm = this.fb.group({
    cargo: [null],
    nombres: [null],
    apellidos: [null],
    foto: [null],
    titulo: [null],
    descripcion: [null],
    fechaNacimiento: [null],
    redesSociales: [null],
    estado: [null],
    nombreImgen: [null]
  })

  LlenarForm(resp: any) {
    const {
      cargo,
      nombres,
      apellidos,
      imagen,
      titulo,
      descripcion,
      fechaNacimiento,
      redesSociales,
      estado
    } = resp;
    this.funcionarioSeleccionada = resp;
    this.registerForm.patchValue({
      cargo,
      nombres,
      apellidos,
      titulo,
      descripcion,
      fechaNacimiento,
      estado
    });
    /* this.registerForm.get('tipo')?.setValue(tipo);
    this.registerForm.get('descripcion')?.setValue(descripcion);
    this.registerForm.get('estado')?.setValue(estado);
    this.registerForm.get('path')?.setValue(path); */
  }

  campoNoValido(campo: any): boolean {
    if (this.registerForm.get(campo)?.invalid && (this.registerForm.get(campo)?.dirty || this.registerForm.get(campo)?.touched)) {
      return true;
    }
    else {
      return false;
    }
  }

  crearFuncionario() {

    if (this.funcionarioSeleccionada) {
      //actualizar
      this.FuncionarioModel = this.registerForm.value;
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

        this.registerForm.value.Funcionario = this.files1;
        this.registerForm.value.fileBase64 = this.files1;
        this.registerForm.value.nombreImagen = this.nombreImagen;//nombre de la imagen

        this.funcionarioService.updateFuncionario(this.funcionarioSeleccionada._id, this.registerForm.value).subscribe((resp: any) => {
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
          this.router.navigateByUrl('/funcionarios');
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

      this.registerForm.value.Funcionario = this.files1;
      this.registerForm.value.fileBase64 = this.files1;
      this.registerForm.value.nombreImagen = this.nombreImagen;//nombre de la imagen
      console.log(this.registerForm.value);
      this.funcionarioService.crearFuncionario(this.registerForm.value).subscribe((resp: any) => {
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
        this.router.navigateByUrl('/funcionarios');
      }, (err: any) => { });
    }


  }

  cancelarGuardado() {
    this.router.navigateByUrl('/funcionarios')
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
