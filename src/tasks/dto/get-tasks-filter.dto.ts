import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task.model';

class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

export { GetTasksFilterDto };
