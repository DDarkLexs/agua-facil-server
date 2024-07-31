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

    interface Address {
        county: string;
        state: string;
        ISO3166_2_lvl4: string;
        country: string;
        country_code: string;
      }
      
      interface LocationData {
        place_id: number;
        licence: string;
        osm_type: string;
        osm_id: number;
        lat: string;
        lon: string;
        category: string;
        type: string;
        place_rank: number;
        importance: number;
        addresstype: string;
        name: string;
        display_name: string;
        address: Address;
        boundingbox: string[];
      }
      

    interface IUsuarioReq extends Usuario {
        motorista: Motorista;
    }
    iat: number;
    exp: number;
}

