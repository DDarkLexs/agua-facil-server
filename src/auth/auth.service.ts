import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { $Enums, Cliente, Motorista } from '@prisma/client';
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


  async insertMotoristaUsuario(userData: CreateUsuarioDto, data: CreateMotoristaDto): Promise<any> {
    userData.tipo = $Enums.UsuarioTipo.MOTORISTA
    // Verifica se o usuário já existe no banco de dados
    const existingUser = await this.prisma.usuario.findUnique({
      where: {
        telefone: userData.telefone, // Supondo que telefone seja um identificador único
      },
    });

    if (existingUser) {
      throw new ConflictException('já existe um usuário com este número de telefone!'); // Lança um erro se o usuário já existir
    }

    // Se o usuário não existe, continua com a criação do usuário e motorista
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
      throw new NotFoundException('Usuário não encontrado ou senha incorreta!'); // Trate como preferir (ex.: retornando um erro)
    }
    if (usuarioNoBanco.tipo !== $Enums.UsuarioTipo.MOTORISTA) {
      throw new UnauthorizedException('Usuário não autorizado para autenticar como motorista!'); // Trate como preferir (ex.: retornando um erro)
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

  async insertClienteUsuario(
    data: CreateUsuarioDto,

  ): Promise<any> {
    const existingUser = await this.prisma.usuario.findUnique({
      where: {
        telefone: data.telefone, // Supondo que telefone seja um identificador único
      },
    });
    if (existingUser) {
      throw new ConflictException('já existe um usuário com este número de telefone!'); // Lança um erro se o usuário já existir
    }
    data.senha = await this.hashService.hashPassword(data.senha);
    data.tipo = $Enums.UsuarioTipo.CLIENTE
    const newUsuario = await this.prisma.usuario.create({
      data: data,
    });

    const newCliente = this.createCliente({
      usuarioId: newUsuario.id,
      fotoPerfil: "https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png",
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
  async authClienteUsuario(authUsuario: AuthUsuarioDto): Promise<IAuthUserCliente> {
    const { senha, telefone } = authUsuario;

    // Recupera o usuário do banco de dados usando o contacto fornecido
    const usuarioNoBanco = await this.prisma.usuario.findUnique({
      where: {
        telefone,
      },
      include: {
        Cliente: {},
      },

    });
    if (!usuarioNoBanco) {
      throw new NotFoundException('Usuário não encontrado!'); // Trate como preferir (ex.: retornando um erro)
    }
    // Exemplo de validação da senha (se estiver usando criptografia)
    const senhaValida = await this.hashService.comparePasswords(senha, usuarioNoBanco.senha);

    if (usuarioNoBanco.tipo !== $Enums.UsuarioTipo.CLIENTE) {
      throw new UnauthorizedException('Usuário não autorizado para autenticar como cliente!'); // Trate como preferir (ex.: retornando um erro)
    }
    if (!senhaValida) {
      throw new UnauthorizedException('Senha incorreta'); // Trate como preferir (ex.: retornando um erro)
    }

    const token = await this.jwtService.signAsync(usuarioNoBanco);

    // Retorna os dados do usuário autenticado
    const { Cliente, ...usuario } = usuarioNoBanco;
    return {
      usuario,
      cliente: Cliente,
      token,
    };
  }
  async validateUserPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await this.hashService.comparePasswords(password, hashedPassword);
  }
}
