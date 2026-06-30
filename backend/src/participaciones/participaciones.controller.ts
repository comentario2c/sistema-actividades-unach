import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ParticipacionesService } from './participaciones.service';

export class InscribirDto {
  usuarioId!: number;
  actividadId!: number;
}

export class AsistenciaDto {
  asistencia!: boolean;
}

@Controller('participaciones')
export class ParticipacionesController {
  constructor(
    private readonly participacionesService: ParticipacionesService,
  ) {}

  @Post('inscribir')
  inscribir(@Body() body: InscribirDto) {
    return this.participacionesService.inscribir(
      body.usuarioId,
      body.actividadId,
    );
  }

  @Patch(':id/asistencia')
  marcarAsistencia(
    @Param('id') id: string,
    @Body('asistencia') asistencia: boolean,
  ) {
    return this.participacionesService.marcarAsistencia(+id, asistencia);
  }

  @Get('actividad/:actividadId')
  obtenerPorActividad(@Param('actividadId') actividadId: string) {
    return this.participacionesService.obtenerPorActividad(+actividadId);
  }

  @Get('usuario/:usuarioId')
  obtenerPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.participacionesService.obtenerPorUsuario(+usuarioId);
  }
}
