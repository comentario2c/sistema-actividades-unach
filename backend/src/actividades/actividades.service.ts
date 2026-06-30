import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateActividadDto } from './dto/create-actividade.dto';
import { UpdateActividadDto } from './dto/update-actividade.dto';
import { Actividad } from './entities/actividade.entity';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ActividadesService {
  private genAI: GoogleGenerativeAI;

  constructor(
    @InjectRepository(Actividad)
    private actividadRepository: Repository<Actividad>,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey ?? '');
  }

  async create(createActividadDto: CreateActividadDto) {
    return this.actividadRepository.save(createActividadDto);
  }

  findAll() {
    return this.actividadRepository.find();
  }

  findOne(id: number) {
    return this.actividadRepository.findOneBy({ id });
  }

  async update(id: number, updateActividadDto: UpdateActividadDto) {
    await this.actividadRepository.update(id, updateActividadDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.actividadRepository.delete(id);
    return {
      success:
        result.affected !== null &&
        result.affected !== undefined &&
        result.affected > 0,
    };
  }

  async generarDescripcionIA(titulo: string): Promise<string> {
    const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Actúa como un coordinador académico universitario. Escribe una y solo una (no debes de dar opciones, debes de dar solo una respuesta, que contenga solo la descripcion y nada mas) descripción formal y breve (máximo 3 líneas) para una actividad institucional llamada: "${titulo}".`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}
