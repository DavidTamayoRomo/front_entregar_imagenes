import { Pipe, PipeTransform } from '@angular/core';
import { ImagenService } from '../services/imagen.service';
import { lastValueFrom } from 'rxjs';


@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  constructor(private imgenService: ImagenService) { }

  async transform(valor: string): Promise<any> {
    let datos = await this.imagebnPromesa(valor);
    return datos;
  }

  async imagebnPromesa(valor: any) {
    const get$ = this.imgenService.getImagenFileServer(valor);
    return await lastValueFrom(get$)
      .then((resp: any) => {
        let img = resp.data.Contenido;
        return `data:image/png;base64,${img}`;
      })
      .catch((err: any) => err);
  }

}
