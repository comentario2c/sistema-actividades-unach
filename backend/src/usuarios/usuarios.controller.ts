import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { RolUsuario } from './entities/usuario.entity';

// Definimos los tipos esperados para eliminar el uso de 'any'
export class RegistroDto {
  email!: string;
  password!: string;
  rol?: RolUsuario;
}

export class LoginDto {
  email!: string;
  password!: string;
}

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  registrar(@Body() body: RegistroDto) {
    return this.usuariosService.registrar(body.email, body.password, body.rol);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.usuariosService.login(body.email, body.password);
  }
}
