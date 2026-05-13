// BAD PRACTICE: DO NOT USE REPOSITORIES ANYMORE. USE THE SERVICE LAYER INSTEAD.
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

// Custom repository for the Task entity (wrapper)
@Injectable()
class TasksRepository {
  constructor(
    // Inject the Task repository to be used in the service
    @InjectRepository(Task) private tasksRepository: Repository<Task>,
  ) {}

  async findMany(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;

    // 'task' is the alias for the Task entity
    const query = this.tasksRepository.createQueryBuilder('task');
    // Filter by user
    query.where({ user });

    if (status) {
      // :status is a placeholder for the status value in {}. It is a named parameter.
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      // LIKE is a partial match operator in SQL
      // LOWER is used to convert the search string to lowercase
      // :search is a placeholder for the search value in {}. It is a named parameter.
      // % is a wildcard that matches any number of characters
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    // Create object from the DTO, we first create the object so we can perform operations on it before saving it to the database
    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    // Save the object to the database
    await this.tasksRepository.save(task);

    return task;
  }

  // Keep null since TypeORM genuinely returns null if the task is not found
  async findById(id: string, user: User): Promise<Task | null> {
    // findOne comes from the Repository API (TypeORM)
    return this.tasksRepository.findOne({ where: { id, user } });
  }

  async deleteById(id: string, user: User): Promise<DeleteResult> {
    return this.tasksRepository.delete({ id, user });
  }

  async save(task: Task): Promise<Task> {
    return this.tasksRepository.save(task);
  }
}

export { TasksRepository };
