import { Controller, Post, Body } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('registro')
  registrar(@Body() body: any) {
    return this.usuariosService.registrar(body.email, body.password, body.rol);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.usuariosService.login(body.email, body.password);
  }
}
