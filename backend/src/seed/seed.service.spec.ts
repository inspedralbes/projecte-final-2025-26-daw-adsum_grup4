import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuari } from '../entities/usuari.entity';
import { Grup } from '../entities/grup.entity';
import { Assignatura } from '../entities/assignatura.entity';
import { AssignacioDocent } from '../entities/assignacio-docent.entity';
import { Sessio } from '../entities/sessio.entity';
import { ConfiguracioCentre } from '../entities/configuracio-centre.entity';

describe('SeedService', () => {
  let service: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        { provide: getRepositoryToken(Usuari), useValue: {} },
        { provide: getRepositoryToken(Grup), useValue: {} },
        { provide: getRepositoryToken(Assignatura), useValue: {} },
        { provide: getRepositoryToken(AssignacioDocent), useValue: {} },
        { provide: getRepositoryToken(Sessio), useValue: {} },
        { provide: getRepositoryToken(ConfiguracioCentre), useValue: {} },
      ],
    }).compile();

    service = module.get<SeedService>(SeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
