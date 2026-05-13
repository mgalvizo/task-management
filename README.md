## NestJS Modules

Each application has at least one module - the root module. That is the starting point of the application.

Modules are an effective way to organize components by a closely related set of capabilities (e.g. per feature).

It is a good practice to have a folder per module, containing the module's components.

Modules are **singletons**, therefore a module can be imported by multiple other modules.

## Defining a Module

A module is defined by annotating a class with the `@Module` decorator.

The decorator provides metadata that Nest uses to organize the application structure.

## @Module Decorator Properties

- **providers**: array of providers to be available within the module via dependency injection.
- **controllers**: array of controllers to be instantiated within the module.
- **exports**: array of providers to export to other modules.
- **imports**: list of modules required by this module. Any exported provider by these modules will now be available in our module via dependency injection.

## Example

```mermaid
flowchart BT
  A[ForumModule]
  B[PostModule]
  C[CommentModule]
  D[AuthModule]
  E[UserProfileModule]

  E --> B
  E --> C
  B --> A
  C --> A
  D --> A
```

```ts
@Module({
  providers: [ForumService],
  controllers: [FormController],
  imports: [PostModule, CommentModule, AuthModule],
  exports: [ForumService],
})
export class ForumModule {}
```

## NestJS Controllers

Responsible for handling incoming requesta and returning responses to the client.

Bound to a specific path (for example `/tasks` for the task resource).

Contain handlers, which handle endpoints and request methods (`GET`, `PUT`, `POST`, `DELETE`, etc).

Can take advantage of dependency injection to consume providers within the same module.

## Defining a Controller

Controllers are defined by decorating a class with the `@Controller` decorator.

The decorator accepts a string, which is the path to be handled by the controller.

```ts
@Controller('/tasks')
export class TaskController {}
```

## Defining a hanlder

Handlers are simply methods within the controller class, decorated with decorators such as `@Get`, `@Post`, `@Delete`, etc.

```ts
@Controller('/tasks')
export class TaskController {
  @Get()
  getAllTasks() {
    return;
  }

  @Post()
  createTask() {
    return;
  }
}
```

## NestJS Providers

Can be injected into constructors if decorated as an `@Injectable`, via dependency injection.

Can be a plain value, a class, a sync/async factory, etc.

Providers must be provided to a module for them to be usable.

Can be exported from a module - and then be available to other modules that import it.

## Services

Defined as a provider. **Not all providers are services**.

Common concept within software development.

Singleton when wrapped within `@Injectable` and provided to a module. That means, the same instance will be shared across the application - acting as a single source of truth.

The main source of business logic. For example, a service will be called from a controller to validate data, create an item in the database and return a response.

```mermaid
flowchart LR
  A[Controller]
  B[Service A]
  C[Service B]
  D[Service C]

  A -- Dependency Injection --> B
  A -- Dependency Injection --> C
  A -- Dependency Injection --> D
```

```ts
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { LoggerService } from '../shared/logger.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, LoggerService],
})
export class TasksModule {}
```

## Dependency Injection in NestJS

Any component within the NestJS ecosystem can inject a provider that is decorated with the `@Injectable`.

We define the dependencies in the constructor of the class. NestJS will take care of the injection for us, and it will then be available as a class property.

```ts
import { TasksService } from './tasks.service';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getAllTasks() {
    return await this.tasksService.getAllTasks();
  }
}
```

## Data Transfer Object (DTO)

An object that carries data between processes.

An object that is used to encapsulate data, and send it from one subsystem of an application to another.

An object that defines how the data will be sent over the network.

It can be used as a TypeScript type resulting in more bulletproof code.

It does **NOT** have any behavior except for storage, retrieval, serialization and deserialization of its own data.

It results in increased performance (although negligible in small applications).

Can be useful for data validation.

A DTO is **NOT** a model definition. It defines the shape of data for a specific case (operation), for example creating a task.

Can be defined using an interface or a class.

## Classes vs Interfaces for DTOs

DTOs can be defined as classes or interfaces.

The recommended approach is to use **classes**, also clearly documented in the NestJS documentation.

The reason is that interfaces are part of TypeScript and therefore are not preserved post-compilation.

Classes allow us to do more, and since they are a part of JavaScript, they will be preserved post-compilation.

NestJS cannot refer to interfaces in run-time, but can refer to classes.

**Classes are the way to go for DTOs**

```mermaid
---
config:
  class:
    hideEmptyMembersBox: true
---
classDiagram
  class CreateShippingDTO {
    orderId: string;
    deliveryAddress: Address;
    requireSignature: Boolean;
  }
  class UpdateShippingAddressDTO {
    streetName: string;
    houseNumber: number;
    zipCode: string;
    city: string;
    country: string;
  }
  class CreateTransitDTO {
    deliveryIds: string[];
    driverId: string;
    vehicleNumber: number;
    departureTime: UTCDate;
  }
```

DTOs are **NOT** mandatory.

You can still develop applications without using DTOs.

However, the value they add makes it worthwhile to use them when applicable.

Applying the DTO pattern as soon as possible will make it easy for you to maintain and refactor your code.

## PATCH Best Practices

- Refer to the resource in the URL.
- Refer to a specific item by ID.
- Specify what has to be patched in the URL.
- Provide the required parameters in the request body.
- `PATCH http://localhost:3000/tasks/be8b4cc2-7732-45e5-81a0-1b5c738484d2/status`

## NestJS Pipes

Pipes operate on the **arguments** to be processed by the route handler, just before the handler is called.

Pipes can perform **data transformation** or **data validation**.

Pipes can return data (either original or modified) which will be passed on to the route handler.

Pipes can throw exceptions. Exceptions thrown will be handled by NestJS and parsed into an error response.

Pipes can be asynchronous.

## Default pipes in NestJS

NestJS ships with useful pipes within the `@nestjs/common` module.

### ValidationPipe

Validates the compatibility of an entire object against a class (goes well with DTOs). If any property cannot be mapped correctly (for example, mismatching type) validation will fail.

### ParseInt Pipe

By default, arguments are of type `String`. This pipe validates that an argument is a number. If successful, the argument is transformed into a **Number** and passed on to the handler.

## Custom Pipe Implementation

Pipes are classes annotated with the `@Injectable` decorator.

Pipes must implement the `PipeTransform` generic interface. Therefore, every pipe must have a `transform()` method. This method will be called by NestJS to process the arguments.

The `transform()` method accepts two parameters:

- **value** the value of the processed argument.
- **metadata** (optional) an object containing metadata about the argument.

Whatever is returned from the `transform()` method will be passed on to the route handler. Exceptions will be sent back to the client.

Pipes can be consumed in different ways.

**Handler-level pipes** are defined at the handler level, via the `@UsePipes()` decorator. Such pipe will process all parameters for the incoming requests.

```ts
@Post()
@UsePipes(SomePipe)
createTask(@Body('description') description:string) {}
```

**Global pipes** are defined at the application level and will be applied to any incoming request.

```ts
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(SomePipe);
  await app.listen(3000);
}
bootstrap();
```

## Parameter-level vs Handler-level pipes. Which one?

**It depends**.

**Parameter-level pipes** tend to be slimmer and cleaner. However, they often result in extra code added to handlers, this can get messy and hard to maintain.

**Handler-level pipes** require some more code, but provide some great benefits:

- Such pipes do not require extra code at the parameter level.
- Easier to maintain and expand. If the shape of the data changes, it is easy to make the necessary changes within the pipe only.
- Responsibility of identifying the arguments to process is shifted to one central file (the pipe file).
- Promote usage of DTOs which is a very good practice.

Extensive [list](https://github.com/typestack/class-validator#validation-decorators) of validation decorators available in `class-validator`.

## Docker

Create container:

```bash
docker run --name postgres-nest -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
```

| Part                            | Meaning                                                               |
| ------------------------------- | --------------------------------------------------------------------- |
| `docker run`                    | Create and start a new container                                      |
| `--name postgres-nest`          | Assign the container the name `postgres-nest`                         |
| `-p 5432:5432`                  | Map port `5432` from your machine to port `5432` inside the container |
| `-e POSTGRES_PASSWORD=postgres` | Set an environment variable inside the container                      |
| `-d`                            | Run in detached mode (background)                                     |
| `postgres`                      | The Docker image to use from DockerHub                                |

List containers:

```bash
docker container ls
```

Start created container

```bash
docker start postgres-nest
```

Stop the container

```bash
docker container stop postgres-nest
```

Delete container

```bash
docker container rm postgres-nest
```

## Object Relational Mapping (ORM)

Object-Relational Mapping (ORM) is a technique that lets you query and manipulate data from a database, using an object-oriented paradigm.

There are many ORM libraries that allow developers to communicate to the database using their preferred programming language rather than sending plain queries directly.

## Pros and Cons of using an ORM Library

| Pros                                                                                           | Cons                                                                                                                                |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Writing the data model in one place &mdash; easier to maintain. Less Repetition.               | You have to learn it, ORM libraries are not always simple.                                                                          |
| Lots of things done automatically &mdash; database handling, data types, relations, etc.       | Performance is alright, but it's easy to neglect.                                                                                   |
| No need to write SQL syntax (easy to learn, hard to master). Using your natural way of coding. | Makes it easy to forget (or never learn) what's happening behind the scenes, which can lead to a variety of maintainability issues. |
| Database abstraction &mdash; you can change the database type whenever you wish.               |                                                                                                                                     |
| Leverages OOP, therefore things like inheritance are easy to achieve.                          |                                                                                                                                     |

## TypeORM

TypeORM is an ORM library that can run in Node.js and be used with TypeScript (or JavaScript).

Helps us define and manage entities, repositories, columns, relations, replication, indices, queries, logging and so much more.

### Example

Retrieve all tasks owned by "Ashley" and are of status "Done".

```ts
const tasks = await Tasks.find({ status: 'DONE', user: 'Ashley' });
```

- [TypeORM docs](https://typeorm.io/docs/getting-started).
- [Repository API](https://typeorm.io/docs/working-with-entity-manager/repository-api#repository-api)

## JSON Web Tokens (JWT)

Open source industry standard (RFC-7519).

Usable for authorization or secure exchange of information between parties.

Verify that the sender is who it/he/she claims to be.

Signed by the issuer, using a secret keypair (HMAC algorithm, RSA or ECDSA).

JSON Web Tokens can be decoded by anyone. They should not contain sensitive information such as passwords.

It is useful for front-end applications to use these tokens to toggle features conditionally. For example, if a user is an administrator, we could show or hide a certain button based on the claims in the token.

JWT should ideally be short-lived.

## JWT Structure

- **Header**: contains metadata about the token (type, hashing algorithm).
- **Payload**: contains claims (statements about an entity, e.g. a user's additional data).
- **Signature**: is the result of the encoded header, the encoded payload, signed against a secret.

## Logging

- **Log**: General purpose logging of important information.
- **Warning**: Unhandled issue that is **NOT** fatal or destructive.
- **Error**: Unhandled issue that is fatal or destructive.
- **Debug**: Useful information that can help us debug the logic in case of an error/warning. Intended for developers.
- **Verbose**: Information providing insights about the behavior of the application. Intended for operators (for example, support). Usually "too much information".

## Log Levels

|             | Log     | Error   | Warning  | Debug    | Verbose  |
| ----------- | ------- | ------- | -------- | -------- | -------- |
| Development | &#9989; | &#9989; | &#9989;  | &#9989;  | &#9989;  |
| Staging     | &#9989; | &#9989; | &#9989;  | &#x274c; | &#x274c; |
| Production  | &#9989; | &#9989; | &#x274c; | &#x274c; | &#x274c; |
