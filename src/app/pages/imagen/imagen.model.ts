export class Imagen {
    constructor(
        public _id?:string,
        public tipo?:string,
        public descripcion?:string,
        public estado?:boolean,
        public imagen?:string,
        public imagenReducida?:string,
        public path?:string,
        public nombreImagen?:string,
        public fileBase64?:string,
        public fechasActualizacion?:any,
        public usuario_creacion?:string,
        public usuario_actualizacion?:string,

    ){}
}