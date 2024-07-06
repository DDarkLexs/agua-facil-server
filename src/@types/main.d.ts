import { Cliente, Motorista, Usuario } from "@prisma/client";
declare global {
    interface IAuthUserDriver {
        usuario: Usuario;
        motorista: Motorista;
        token: string;
    }
    interface IAuthUserCliente {
        usuario: Usuario;
        cliente: Cliente;
        token: string;
    }

    interface IUsuarioReq extends Usuario {
        Motorista: Motorista;
    }
    iat: number;
    exp: number;
}

