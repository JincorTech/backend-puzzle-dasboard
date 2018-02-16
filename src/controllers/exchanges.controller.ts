import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpGet } from 'inversify-express-utils';
import 'reflect-metadata';
import config from '../config';
import { getMongoManager } from 'typeorm';
import { Exchange } from "../entities/exchange";

/**
 * Assets controller
 */
@injectable()
@controller(
  '/exchanges'
)
export class ExchangesController {

  /**
   * Get the list of available exchanges
   */
  @httpGet(
    '/',
  )
  async exchanges(req: Request, res: Response): Promise<void> {
    const exchanges = await getMongoManager().createEntityCursor(Exchange).toArray();
    res.json(exchanges);
  }

}
