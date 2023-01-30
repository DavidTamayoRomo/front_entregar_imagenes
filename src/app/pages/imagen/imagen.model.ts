export class Imagen {
    constructor(
        public _id?:string,
        public tipo?:string,
        public descripcion?:string,
        public estado?:boolean,
        public imagen?:string,
        public path?:string,
        public nombreImagen?:string,
        public fileBase64?:string,
        public fechasActualizacion?:any,
    ){}
}