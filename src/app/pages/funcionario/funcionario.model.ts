export class Funcionario {
    constructor(
        public _id?:string,
        public cargo?:string,
        public nombres?:string,
        public apellidos?:string,
        public foto?:string,
        public titulo?:string,
        public descripcion?:string,
        public fechaNacimiento?:Date,
        public redesSociales?:any,
        public estado?:boolean,
        public usuario_creacion?:string,
        public usuario_actualizacion?:string,
    ){}
}