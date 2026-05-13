import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    // Database configuration, adding the configuration directly
    // is not the recommended approach, use forRoot for the root module
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'task-management',
      // Automatically load all entities (.entity.ts files)
      autoLoadEntities: true,
      // Automatically synchronize the database schema with the entities
      synchronize: true,
    }),
    AuthModule,
  ],
})
export class AppModule {}
