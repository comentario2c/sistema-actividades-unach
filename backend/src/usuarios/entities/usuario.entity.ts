import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum RolUsuario {
  ADMIN = 'admin',
  ESTUDIANTE = 'estudiante',
  DOCENTE = 'docente',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  passwordHash!: string;

  @Column({ type: 'enum', enum: RolUsuario, default: RolUsuario.ESTUDIANTE })
  rol!: RolUsuario;
}
