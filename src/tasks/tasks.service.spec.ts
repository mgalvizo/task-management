import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

// Mock the TasksRepository
const mockTasksRepository = () => ({
  findMany: jest.fn(),
  findById: jest.fn(),
});

const mockUser = {
  username: 'John Doe',
  id: '123',
  password: 'password',
  tasks: [],
};

describe('TasksService', () => {
  let tasksService: TasksService;
  let tasksRepository: ReturnType<typeof mockTasksRepository>;

  // Create dummy module that contains the TasksService and TasksRepository
  beforeEach(async () => {
    // Initialize a NestJS module with the TasksService and TasksRepository
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    tasksRepository =
      module.get<ReturnType<typeof mockTasksRepository>>(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.findMany and returns the result', async () => {
      expect(tasksRepository.findMany).not.toHaveBeenCalled();

      // Mock resolved because it is a Promise
      tasksRepository.findMany.mockResolvedValue('someValue');
      const result = await tasksService.findTasks(null, mockUser);

      expect(tasksRepository.findMany).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('calls TasksRepository.findById and returns the result', async () => {
      const mockTask = {
        id: 'someId',
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
      };

      tasksRepository.findById.mockResolvedValue(mockTask);
      const result = await tasksService.findTaskById('someId', mockUser);

      expect(tasksRepository.findById).toHaveBeenCalledWith('someId', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findById and throws an error as task is not found', async () => {
      tasksRepository.findById.mockResolvedValue(null);

      await expect(
        tasksService.findTaskById('someId', mockUser),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
