import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import 'reflect-metadata';

@Entity()
export class Asset {

  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  symbol: string;

  @Column()
  marketCapUSD: number;

  @Column()
  totalAmount: number;

  @Column()
  currentPrice: number;

  @Column()
  lastPriceUpdate: number;

}
