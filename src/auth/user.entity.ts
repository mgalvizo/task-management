import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { Task } from '../tasks/task.entity';

@Entity()
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // unique username
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  // 1 to many relationship
  // One user can have many tasks
  // eager: true means that the tasks will be loaded automatically when the user is loaded
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}

export { User };
