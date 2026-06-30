import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario, RolUsuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async registrar(
    email: string,
    passwordPlana: string,
    rol: RolUsuario = RolUsuario.ESTUDIANTE,
  ) {
    const existe = await this.usuarioRepository.findOneBy({ email });
    if (existe) throw new ConflictException('El email ya está registrado');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlana, salt);

    const nuevoUsuario = this.usuarioRepository.create({
      email,
      passwordHash,
      rol,
    });
    const guardado = await this.usuarioRepository.save(nuevoUsuario);
    return { id: guardado.id, email: guardado.email, rol: guardado.rol };
  }

  async login(email: string, passwordPlana: string) {
    const usuario = await this.usuarioRepository.findOneBy({ email });
    if (!usuario) throw new UnauthorizedException('Credenciales inválidas');

    const esValida = await bcrypt.compare(passwordPlana, usuario.passwordHash);
    if (!esValida) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: usuario.id, email: usuario.email, rol: usuario.rol };
    return {
      access_token: await this.jwtService.signAsync(payload),
      usuario: { email: usuario.email, rol: usuario.rol },
    };
  }
}
