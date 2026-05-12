import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;
}

export { GetTasksFilterDto };
