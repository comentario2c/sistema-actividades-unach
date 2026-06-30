import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Actividad } from '../../actividades/entities/actividade.entity'; // Revisa que este nombre coincida con tu archivo real

@Entity('participaciones')
export class Participacion {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.id, { eager: true })
  usuario!: Usuario;

  @ManyToOne(() => Actividad, (actividad) => actividad.id, { eager: true })
  actividad!: Actividad;

  @Column({ default: false })
  asistencia!: boolean;

  @CreateDateColumn()
  fechaInscripcion!: Date;
}
