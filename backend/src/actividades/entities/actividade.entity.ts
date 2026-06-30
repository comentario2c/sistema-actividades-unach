import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('actividades')
export class Actividad {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titulo!: string;

  @Column('text', { nullable: true })
  descripcion!: string;

  @Column({ default: true })
  estado!: boolean;
}
