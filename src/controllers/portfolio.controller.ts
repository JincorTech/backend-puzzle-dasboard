import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { controller, httpPost, httpGet } from 'inversify-express-utils';
import 'reflect-metadata';
import config from '../config';
import { getConnection, getMongoManager } from 'typeorm';
import { Asset } from '../entities/asset';
import  { Transaction } from '../entities/transaction';
import * as mongodb from "mongodb";
import fetch from "node-fetch";
global.fetch = fetch;
import * as cryptocompare from "cryptocompare";

/**
 * Portfolio controller
 */
@injectable()
@controller(
  '/portfolio'
)
export class PortfolioController {

  /**
   * Get the portfolio summary
   */
  @httpGet(
    '/summary',
  )
  async summary(req: Request, res: Response): Promise<void> {
    const assets = await getMongoManager().createEntityCursor(Asset, {totalAmount: {'$gt': 0}}).toArray();
    let totalValue = 0;
    let prevTotalValue = 0;
    let weekValue = 0;
    let monthValue = 0;
    let tMonthValue = 0;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    for (let asset of assets) {
      let prevTime = new Date();
      prevTime.setDate(prevTime.getDate() - 1);
      let currentPrice = await cryptocompare.price(asset.symbol, 'USD');
      asset.currentPrice = currentPrice.USD;
      asset.lastPriceUpdate = currentTimestamp;
      let prevPrice = await cryptocompare.priceHistorical(asset.symbol, 'USD', prevTime);
      console.log('Prev price: ', prevPrice, prevTime);
      prevTime.setDate(prevTime.getDate() - 6);
      let weekPrice = await cryptocompare.priceHistorical(asset.symbol, 'USD', prevTime);
      prevTime.setDate(prevTime.getDate() + 7);
      prevTime.setMonth(prevTime.getMonth() - 1);
      let monthPrice = await cryptocompare.priceHistorical(asset.symbol, 'USD', prevTime);
      prevTime.setMonth(prevTime.getMonth() - 2);
      let tMonthPrice = await cryptocompare.priceHistorical(asset.symbol, 'USD', prevTime);
      getMongoManager().save(asset);
      totalValue += asset.currentPrice * asset.totalAmount;
      prevTotalValue += prevPrice.USD * asset.totalAmount;
      console.log("Current value for "  + asset.symbol, asset.currentPrice * asset.totalAmount);
      console.log("Prev value for "  + asset.symbol, prevPrice.USD * asset.totalAmount);
      weekValue += weekPrice.USD * asset.totalAmount;
      monthValue += monthPrice.USD * asset.totalAmount;
      tMonthValue += tMonthPrice.USD * asset.totalAmount;
    }
    console.log("Total value: ", totalValue);
    console.log("Prev value: ", prevTotalValue);
    let change = ((totalValue - prevTotalValue) / prevTotalValue) * 100;
    let weekChange = ((totalValue - weekValue) / weekValue) * 100;
    let monthChange = ((totalValue - monthValue) / monthValue) * 100;
    let tMonthChange = ((totalValue - tMonthValue) / tMonthValue) * 100;
    res.json(
      {
        netAssetValue: {
            value: totalValue,
            change: change
        },
        changes: {
            oneWeek: weekChange,
            oneMonth: monthChange,
            threeMonths: tMonthChange
        },
        caquisitionCost: 1291450,
        profitLoss: (totalValue / 100) * change * -1
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
    const assets = await getMongoManager().createEntityCursor(Asset, {totalAmount: {'$gt': 0}}).toArray();
    let prevTime = new Date();
    prevTime.setDate(prevTime.getDate() - 1);
    let response = [];
    for (let asset of assets) {
      const transactions = await getMongoManager().createEntityCursor(Transaction, {"asset.symbol": asset.symbol}).toArray();
      let moneySpent = 0;
      for  (let transaction of transactions) {
        let time = new Date(transaction.timestamp * 1000);
        let val = transaction.value *  transaction.price;
        if (transaction.direction === true) {
          moneySpent += val;
        } else {
          moneySpent -= val;
        }
      }
      let currentPrice = (await cryptocompare.price(asset.symbol, 'USD')).USD;
      let prevPrice = (await cryptocompare.priceHistorical(asset.symbol, 'USD', prevTime)).USD;
      let change = ((currentPrice - prevPrice)  / prevPrice) * 100;
      response.push({
        asset: asset.name,
        symbol: asset.symbol,
        qty: asset.totalAmount,
        price: {
          value: currentPrice,
          change: change
        },
        exposure: 140394, //TODO
        profitLoss: {
            value: (asset.totalAmount * currentPrice) - moneySpent,//(asset.totalAmount / 100) * currentPrice * change * -1,
            change: (((asset.totalAmount * currentPrice) - moneySpent)/(moneySpent/100)) *  100
        },
        weight: 4.44 //TODO
      });
    }
    res.json(response);
  }

  /**
   * Get protfolio table
   */
  @httpGet(
    '/chart/value',
  )
  async chart(req: Request, res: Response): Promise<void> {
    const assets = await getMongoManager().createEntityCursor(Asset, {totalAmount: {'$gt': 0}}).toArray();
    let value = 0;
    let aggregatedStats = {};
    let limit;
    let aggregate;
    switch (req.query.period) {
      case '1w':
        limit = 7;
        aggregate = 1;
        break;
      case '1m':
        limit = 30;
        aggregate = 1;
        break;
      case '3m':
        limit = 4;
        aggregate = 7;
        break;
      case '1y':
        limit = 12;
        aggregate = 30;
        break;
    }
    for (let asset of assets) {
        let data;
        if (req.query.period !== '1d') {
            data = await cryptocompare.histoDay(asset.symbol, 'USD', {limit: limit, aggregate: aggregate});
        } else {
            data = await cryptocompare.histoHour(asset.symbol, 'USD', {limit: 24});
        }
        data.map(day => {
          if (typeof aggregatedStats[day.time] === 'undefined' || aggregatedStats[day.time].value === 'undefined') {
            aggregatedStats[day.time] = {};
            aggregatedStats[day.time].value = day.close * asset.totalAmount;
          } else {
            aggregatedStats[day.time].value += day.close * asset.totalAmount;
          }
        });
    }
    let response = [];
    for (let timestamp in aggregatedStats) {
      const item = {timestamp: timestamp, value: aggregatedStats[timestamp].value};
      response.push(item);
    }

    res.json(response);
  }


}
