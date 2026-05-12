import { IsEnum } from 'class-validator';

import { TaskStatus } from '../task-status.enum';

class UpdateTaskStatusDto {
  // Provide the enumeration to validate the status
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export { UpdateTaskStatusDto };
