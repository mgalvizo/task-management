import { TaskStatus } from '../task.model';

class GetTasksFilterDto {
  status?: TaskStatus;
  search?: string;
}

export { GetTasksFilterDto };
