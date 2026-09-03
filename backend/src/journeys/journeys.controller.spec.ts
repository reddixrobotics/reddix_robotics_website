import { Test, TestingModule } from '@nestjs/testing';
import { AdminJourneysController } from './journeys.controller';
import { JourneysService } from './journeys.service';
import { AuditLogService } from '../audit/audit-log.service';

describe('AdminJourneysController', () => {
  let controller: AdminJourneysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminJourneysController],
      providers: [
        {
          provide: JourneysService,
          useValue: {},
        },
        {
          provide: AuditLogService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AdminJourneysController>(AdminJourneysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
