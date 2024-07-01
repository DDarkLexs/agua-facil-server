import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cliente, Motorista } from '@prisma/client';
import { HashService } from '../hash/hash.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthUsuarioDto,
  CreateclienteDto,
  CreateMotoristaDto,
  CreateUsuarioDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly hashService: HashService,
  ) { }

  /* 
  
    ███▄ ▄███▓ ▒█████  ▄▄▄█████▓ ▒█████   ██▀███   ██▓  ██████ ▄▄▄█████▓ ▄▄▄      
    ▓██▒▀█▀ ██▒▒██▒  ██▒▓  ██▒ ▓▒▒██▒  ██▒▓██ ▒ ██▒▓██▒▒██    ▒ ▓  ██▒ ▓▒▒████▄    
    ▓██    ▓██░▒██░  ██▒▒ ▓██░ ▒░▒██░  ██▒▓██ ░▄█ ▒▒██▒░ ▓██▄   ▒ ▓██░ ▒░▒██  ▀█▄  
    ▒██    ▒██ ▒██   ██░░ ▓██▓ ░ ▒██   ██░▒██▀▀█▄  ░██░  ▒   ██▒░ ▓██▓ ░ ░██▄▄▄▄██ 
    ▒██▒   ░██▒░ ████▓▒░  ▒██▒ ░ ░ ████▓▒░░██▓ ▒██▒░██░▒██████▒▒  ▒██▒ ░  ▓█   ▓██▒
    ░ ▒░   ░  ░░ ▒░▒░▒░   ▒ ░░   ░ ▒░▒░▒░ ░ ▒▓ ░▒▓░░▓  ▒ ▒▓▒ ▒ ░  ▒ ░░    ▒▒   ▓▒█░
    ░  ░      ░  ░ ▒ ▒░     ░      ░ ▒ ▒░   ░▒ ░ ▒░ ▒ ░░ ░▒  ░ ░    ░      ▒   ▒▒ ░
    ░      ░   ░ ░ ░ ▒    ░      ░ ░ ░ ▒    ░░   ░  ▒ ░░  ░  ░    ░        ░   ▒   
          ░       ░ ░               ░ ░     ░      ░        ░                 ░  ░
                                                                                  

  
  */
  async insertMotoristaUsuario(
    userData: CreateUsuarioDto,
    data: CreateMotoristaDto,
  ): Promise<any> {
    userData.senha = await this.hashService.hashPassword(userData.senha);
    const newUsuario = await this.prisma.usuario.create({
      data: userData,
    });

    const newMotorista = this.createMotorista({
      ...data,
      usuarioId: newUsuario.id,
    });
    return newMotorista;
  }
  async createMotorista(data: CreateMotoristaDto): Promise<Motorista> {
    const result = await this.prisma.motorista.create({
      data,
      include: {
        Usuario: {},
      },
    });

    return result;
  }
  async authDriverUsuario(authUsuario: AuthUsuarioDto): Promise<IAuthUserDriver> {
    const { senha, telefone } = authUsuario;

    // Recupera o usuário do banco de dados usando o contacto fornecido
    const usuarioNoBanco = await this.prisma.usuario.findUnique({
      where: {
        telefone,
      },
      include: {
        Motorista: {},
      },

    });
    if (!usuarioNoBanco) {
      throw new NotFoundException('Usuário não encontrado!'); // Trate como preferir (ex.: retornando um erro)
    }
    // Exemplo de validação da senha (se estiver usando criptografia)
    const senhaValida = await this.hashService.comparePasswords(senha, usuarioNoBanco.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Senha incorreta'); // Trate como preferir (ex.: retornando um erro)
    }

    const token = await this.jwtService.signAsync(usuarioNoBanco);

    // Retorna os dados do usuário autenticado
    const { Motorista, ...usuario } = usuarioNoBanco;
    return {
      usuario,
      motorista: Motorista,
      token,
    };
  }
  /* 
  
 ▄████▄   ██▓     ██▓▓█████  ███▄    █ ▄▄▄█████▓▓█████ 
▒██▀ ▀█  ▓██▒    ▓██▒▓█   ▀  ██ ▀█   █ ▓  ██▒ ▓▒▓█   ▀ 
▒▓█    ▄ ▒██░    ▒██▒▒███   ▓██  ▀█ ██▒▒ ▓██░ ▒░▒███   
▒▓▓▄ ▄██▒▒██░    ░██░▒▓█  ▄ ▓██▒  ▐▌██▒░ ▓██▓ ░ ▒▓█  ▄ 
▒ ▓███▀ ░░██████▒░██░░▒████▒▒██░   ▓██░  ▒██▒ ░ ░▒████▒
░ ░▒ ▒  ░░ ▒░▓  ░░▓  ░░ ▒░ ░░ ▒░   ▒ ▒   ▒ ░░   ░░ ▒░ ░
  ░  ▒   ░ ░ ▒  ░ ▒ ░ ░ ░  ░░ ░░   ░ ▒░    ░     ░ ░  ░
░          ░ ░    ▒ ░   ░      ░   ░ ░   ░         ░   
░ ░          ░  ░ ░     ░  ░         ░             ░  ░
░                                                      
  
  */
  async insertClienteUsuario(
    userData: CreateUsuarioDto,
    data: CreateclienteDto,
  ): Promise<any> {
    userData.senha = await this.hashService.hashPassword(userData.senha);
    const newUsuario = await this.prisma.usuario.create({
      data: userData,
    });

    const newCliente = this.createCliente({
      usuarioId: newUsuario.id,
      fotoPerfil: data.fotoPerfil,
    });
    return newCliente;
  }
  async createCliente(data: CreateclienteDto): Promise<Cliente> {
    const result = await this.prisma.cliente.create({
      data,
      include: {
        Usuario: {},
      },
    });

    return result;
  }
  /*   async createMotorista(data: CreateMotoristaDto): Promise<Motorista> {
      const result = await this.prisma.motorista.create({
        data,
        include: {
          Usuario: {},
        },
      });
  
      return result;
    }
    async authDriverUsuario(authUsuario: AuthUsuarioDto): Promise<any> {
      const { senha, telefone } = authUsuario;
  
      // Recupera o usuário do banco de dados usando o contacto fornecido
      const usuarioNoBanco = await this.prisma.usuario.findUnique({
        where: {
          telefone,
        },
        include: {
          Motorista: {},
        },
      });
      // Exemplo de validação da senha (se estiver usando criptografia)
      const senhaValida = await this.hashService.comparePasswords(
        senha,
        usuarioNoBanco.senha,
      );
  
      if (!senhaValida) {
        throw new UnauthorizedException('Senha incorreta'); // Trate como preferir (ex.: retornando um erro)
      }
  
      const token = await this.jwtService.signAsync(usuarioNoBanco);
  
      // Retorna os dados do usuário autenticado
      return {
        ...usuarioNoBanco,
        token,
      };
    } */
  async validateUserPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await this.hashService.comparePasswords(password, hashedPassword);
  }
}
