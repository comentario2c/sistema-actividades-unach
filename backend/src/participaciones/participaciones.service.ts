import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participacion } from './entities/participacione.entity';

@Injectable()
export class ParticipacionesService {
  constructor(
    @InjectRepository(Participacion)
    private participacionRepository: Repository<Participacion>,
  ) {}

  async inscribir(usuarioId: number, actividadId: number) {
    const existe = await this.participacionRepository.findOne({
      where: { usuario: { id: usuarioId }, actividad: { id: actividadId } },
    });

    if (existe) {
      throw new ConflictException(
        'El usuario ya está inscrito en esta actividad',
      );
    }

    const nuevaParticipacion = this.participacionRepository.create({
      usuario: { id: usuarioId },
      actividad: { id: actividadId },
    });

    return this.participacionRepository.save(nuevaParticipacion);
  }

  async marcarAsistencia(id: number, asistencia: boolean) {
    const participacion = await this.participacionRepository.findOneBy({ id });
    if (!participacion)
      throw new NotFoundException('Inscripción no encontrada');

    participacion.asistencia = asistencia;
    return this.participacionRepository.save(participacion);
  }

  obtenerPorActividad(actividadId: number) {
    return this.participacionRepository.find({
      where: { actividad: { id: actividadId } },
    });
  }

  obtenerPorUsuario(usuarioId: number) {
    return this.participacionRepository.find({
      where: { usuario: { id: usuarioId } },
    });
  }

  async obtenerEstudiantesPorActividad(actividadId: number) {
    return this.participacionRepository.find({
      where: { actividad: { id: actividadId } },
      relations: { usuario: true },
    });
  }
}
