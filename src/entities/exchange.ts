import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import 'reflect-metadata';

@Entity()
export class Exchange {

  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

}
