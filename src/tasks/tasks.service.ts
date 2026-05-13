import { Injectable, NotFoundException } from '@nestjs/common';

import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { User } from '../auth/user.entity';

@Injectable()
class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  // public by default
  findTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.findMany(filterDto, user);
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.create(createTaskDto, user);
  }

  async findTaskById(id: string, user: User): Promise<Task> {
    const task = await this.tasksRepository.findById(id, user);

    if (task) {
      return task;
    }

    // throw errors in the service layer
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.deleteById(id, user);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findTaskById(id, user);

    const { status } = updateTaskStatusDto;

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}

export { TasksService };
