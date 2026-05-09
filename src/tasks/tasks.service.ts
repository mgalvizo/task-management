import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { TaskStatus } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { NotFoundException } from '@nestjs/common';
import type { Task } from './task.model';

@Injectable()
class TasksService {
  // private for this class only
  private tasks: Task[] = [];

  // public by default
  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
      return tasks;
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );
      return tasks;
    }

    return tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  getTaskById(id: string): Task {
    const task = this.tasks.find((task) => task.id === id);

    if (task) {
      return task;
    }

    throw new NotFoundException(`Task with ID "${id}" not found`);
  }

  deleteTaskById(id: string): void {
    // It already throws an error if the task is not found per method signature
    const task = this.getTaskById(id);

    if (task) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
    }

    return;
  }

  updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
    const task = this.getTaskById(id);

    const { status } = updateTaskStatusDto;

    if (task) {
      task.status = status;
    }

    return task;
  }
}

export { TasksService };
