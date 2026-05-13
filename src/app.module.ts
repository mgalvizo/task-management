import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { configValidationSchema } from './config/configuration.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      // one environment file per stage
      envFilePath: [`.env.stage.${process.env.STAGE}`],
      // Load the configuration file
      load: [configuration],
      // Validate the environment variables set in the .env.stage.${process.env.STAGE} file
      // Validate also the variables set in the script at package.json
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    TasksModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // Dependency injection of the ConfigService
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        //   // Automatically load all entities (.entity.ts files)
        autoLoadEntities: true,
        //   // Automatically synchronize the database schema with the entities
        synchronize: true,
        // Read the database configuration from the configuration file
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
      }),
    }),
    AuthModule,
  ],
})
export class AppModule {}
