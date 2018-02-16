import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Asset } from "./asset";
import { Exchange } from "./exchange";
import 'reflect-metadata';

@Entity()
export class Transaction {

  @ObjectIdColumn()
  id: ObjectID;

  @Column(type => Asset)
  asset: Asset;

  @Column(type => Exchange)
  exchange: Exchange;

  @Column()
  direction: boolean; //true for positive false for negative

  @Column()
  value: number;

  @Column()
  price: number;

  @Column()
  timestamp: number;

  @Column()
  isDeleted: boolean;

  getType() {
    return this.direction == false ? 'sell' : 'buy';
  }

  delete() {
    this.isDeleted = true;
  }

}
