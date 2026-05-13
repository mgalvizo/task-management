import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Task } from './task.entity';

@Module({
  controllers: [TasksController],
  // Inject the TasksRepository to be used in the service
  providers: [TasksService, TasksRepository],
  // Import the Task entity to be used in the repository
  // use forFeature for submodules
  imports: [TypeOrmModule.forFeature([Task]), AuthModule],
})
export class TasksModule {}
