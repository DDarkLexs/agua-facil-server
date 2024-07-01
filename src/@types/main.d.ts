import { Motorista, Usuario } from "@prisma/client";
declare global {
    interface IAuthUserDriver {
        usuario: Usuario;
        motorista: Motorista;
        token: string;
    }
    }