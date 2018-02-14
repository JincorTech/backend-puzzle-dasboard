import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpPost, httpGet } from 'inversify-express-utils';
import 'reflect-metadata';
import config from '../config';
import { getConnection } from 'typeorm';

/**
 * Dashboard controller
 */
@injectable()
@controller(
  '/protfolio'
)
export class PortfolioController {

  /**
   * Get the portfolio summary
   */
  @httpGet(
    '/summary',
  )
  async summary(req: Request, res: Response): Promise<void> {

    res.json(
      {
        netAssetValue: {
            value: 8097386,
            change: 5.02
        },
        changes: {
            oneWeek: -31.83,
            oneMonth: 219.83,
            threeMonths: 394958.83
        },
        caquisitionCost: 1291450,
        profitLoss: 6805936
      }
    );
  }

  /**
   * Get protfolio table
   */
  @httpGet(
    '/table',
  )
  async table(req: Request, res: Response): Promise<void> {

    res.json([
        {
            asset: 'Bitcoin',
            symbol: 'BTC',
            qty: '10.0049495',
            price: {
                value: 13383.30,
                change: -13.76
            },
            exposure: 140394,
            profitLoss: {
                value: 13949494,
                change: 23.44
            },
            weight: 4.44
        },
        {
            asset: 'Ethereum',
            symbol: 'ETH',
            qty: 140.949584,
            price: {
                value: 1506.90,
                change: 13.76
            },
            exposure: 90049,
            profitLoss: {
                value: 999576,
                change: 35.92
            },
            weight: 6.52
        },
        {
            asset: 'Litecoin',
            symbol: 'LTC',
            qty: 2058.48,
            price: {
                value: 150.39,
                change: -13.76
            },
            exposure: 24994,
            profitLoss: {
                value: 2483,
                change: -10.11
            },
            weight: 2.94
        }
    ]);
  }

  /**
   * Get protfolio table
   */
  @httpGet(
    '/chart/value',
  )
  async chart(req: Request, res: Response): Promise<void> {
    res.json([
        {
            timestamp: 1517691315,
            value: 100000
        },
        {
            timestamp: 1517691399,
            value: 100100
        },
        req.query.period
    ]);
  }




}
