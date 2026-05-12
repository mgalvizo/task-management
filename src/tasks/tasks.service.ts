import { Injectable, NotFoundException } from '@nestjs/common';

import { TasksRepository } from './tasks.repository';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';

@Injectable()
class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  // public by default
  findTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.findMany(filterDto);
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.create(createTaskDto);
  }

  async findTaskById(id: string): Promise<Task> {
    const task = await this.tasksRepository.findById(id);

    if (task) {
      return task;
    }

    // throw errors in the service layer
    throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  async deleteTaskById(id: string): Promise<void> {
    const result = await this.tasksRepository.deleteById(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const task = await this.findTaskById(id);

    const { status } = updateTaskStatusDto;

    task.status = status;

    await this.tasksRepository.save(task);

    return task;
  }
}

export { TasksService };
