import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpPost, httpGet, httpDelete } from 'inversify-express-utils';
import 'reflect-metadata';
import config from '../config';
import { getMongoManager, getMongoRepository, getConnection } from 'typeorm';
import { Asset } from '../entities/asset';
import { Exchange } from '../entities/exchange';
import  { Transaction } from '../entities/transaction';
import * as mongodb from "mongodb";

/**
 * Assets controller
 */
@injectable()
@controller(
  '/assets'
)
export class AssetsController {


  /**
   * Get all available assets
   */
  @httpGet(
    '/',
  )
  async showList(req: Request, res: Response): Promise<void> {
    const assets = await getMongoManager().createEntityCursor(Asset).toArray();
    res.json(assets);
  }

  /**
   * Get all transactions
   */
  @httpGet(
    '/tx',
  )
  async transactions(req: Request, res: Response): Promise<void> {
    const asset = await getConnection().getMongoRepository(Asset).findOne({symbol: req.query.asset});
    const transactions = await getMongoManager().createEntityCursor(Transaction, {"asset.symbol": asset.symbol}).toArray();
    res.json(
      {
        asset: asset.name,
        symbol: asset.symbol,
        txs: transactions
      }
    );
  }


  /**
   * Add transaction
   */
  @httpPost(
    '/tx',
  )
  async addTx(req: Request, res: Response): Promise<void> {
    const asset = (await getConnection().getMongoRepository(Asset).findByIds([new mongodb.ObjectId(req.body.asset)]))[0];
    const exchange = (await getConnection().getMongoRepository(Exchange).findByIds([new mongodb.ObjectId(req.body.exchange)]))[0];
    let tx = new Transaction();
    tx.value = parseFloat(req.body.value);
    tx.asset = asset;
    tx.exchange = exchange;
    tx.price = parseFloat(req.body.price);
    tx.timestamp = req.body.timestamp;
    if (req.body.type === 'sell') {
      tx.direction = false;
      asset.totalAmount = asset.totalAmount - tx.value;
    } else {
      tx.direction = true;
      asset.totalAmount = asset.totalAmount + tx.value;
    }
    await getMongoManager().save(tx);
    await getMongoManager().save(asset);
    res.json(
      {
        id: tx.id.toString(),
        type: tx.getType(),
        asset: tx.asset.name,
        timestamp: tx.timestamp,
        exchange: tx.exchange.name,
        value: tx.value,
        price: tx.price
      }
    );
  }


  /**
   * Add transaction
   */
  @httpDelete(
    '/tx',
  )
  async delTx(req: Request, res: Response): Promise<void> {
    let tx = await getMongoRepository(Transaction).findOne(new mongodb.ObjectId(req.body.txId));
    await getConnection().getMongoRepository(Transaction).remove(tx);
    res.json(
      {
        id: req.body.txId
      }
    );
  }

}
