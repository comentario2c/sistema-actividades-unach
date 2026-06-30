import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActividadesController } from './actividades/actividades.controller';
import { ActividadesService } from './actividades/actividades.service';
import { UsuariosController } from './usuarios/usuarios.controller';
import { UsuariosService } from './usuarios/usuarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Actividad } from './actividades/entities/actividade.entity';
import { Usuario, RolUsuario } from './usuarios/entities/usuario.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('Suite de Pruebas Unitarias Globales - UNACH', () => {
  let appController: AppController;
  let actividadesController: ActividadesController;
  let usuariosController: UsuariosController;

  // Mocks de Repositorios para simular MySQL
// Mocks de Repositorios para simular MySQL
  const mockActividadRepository = {
    find: jest
      .fn()
      .mockResolvedValue([
        { id: 1, titulo: 'Actividad de Prueba', estado: true },
      ]),
    save: jest
      .fn()
      .mockImplementation((dto: Partial<Actividad>) =>
        Promise.resolve({ id: 1, ...dto }),
      ),
  };

  const mockUsuarioRepository = {
    findOneBy: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((dto: Partial<Usuario>) => dto),
    save: jest
      .fn()
      .mockImplementation((dto: Partial<Usuario>) =>
        Promise.resolve({ id: 1, ...dto }),
      ),
  };

  // Mocks de Servicios Externos
  const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-api-key'),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController, ActividadesController, UsuariosController],
      providers: [
        AppService,
        ActividadesService,
        UsuariosService,
        {
          provide: getRepositoryToken(Actividad),
          useValue: mockActividadRepository,
        },
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockUsuarioRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    actividadesController = module.get<ActividadesController>(
      ActividadesController,
    );
    usuariosController = module.get<UsuariosController>(UsuariosController);
  });

  describe('1. Verificación de Salud del Sistema (AppController)', () => {
    it('debería responder "Hello World!" en el endpoint raíz', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('2. Pruebas de Gestión de Actividades (CRUD)', () => {
    it('debería listar todas las actividades registradas', async () => {
      const res = await actividadesController.findAll();
      expect(res).toEqual([
        { id: 1, titulo: 'Actividad de Prueba', estado: true },
      ]);
      expect(mockActividadRepository.find).toHaveBeenCalled();
    });

    it('debería registrar una nueva actividad con éxito', async () => {
      const nuevaActividad = {
        titulo: 'Seminario DevOps',
        descripcion: 'Prueba unitaria',
        estado: true,
      };
      const res = await actividadesController.create(nuevaActividad);
      expect(res).toEqual({ id: 1, ...nuevaActividad });
      expect(mockActividadRepository.save).toHaveBeenCalled();
    });
  });

  describe('3. Pruebas de Autenticación y Usuarios', () => {
    it('debería permitir el registro de un nuevo estudiante', async () => {
      const payload = {
        email: 'test@unach.cl',
        password: 'password123',
        rol: RolUsuario.ESTUDIANTE,
      };
      const res = await usuariosController.registrar(payload);
      expect(res).toHaveProperty('id');
      expect(res.email).toBe(payload.email);
    });
  });
});
