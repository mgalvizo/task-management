import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { User } from './user.entity';

const GetUser = createParamDecorator((_data, ctx: ExecutionContext): User => {
  // Get the request object from the context
  const req = ctx.switchToHttp().getRequest();

  return req.user;
});

export { GetUser };
