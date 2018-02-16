import { createConnection, ConnectionOptions } from "typeorm";
import { Asset } from "./entities/asset";
import { Exchange } from "./entities/exchange";
import * as file from "jsonfile";
import * as axios from "axios";
import fetch from 'node-fetch';
import * as cryptocompare from "cryptocompare";
import config from './config';

const ormOptions: ConnectionOptions = config.typeOrm as ConnectionOptions;

global.fetch = fetch;

createConnection(ormOptions).then(async connection => {

  axios.get('https://api.coinmarketcap.com/v1/ticker/?limit=150')
    .then(async res => {
        for (var coin of res.data) {
          let existingAsset = await connection.mongoManager.findOne(Asset, {symbol: coin.symbol});
          if (existingAsset) {
            if (!existingAsset.lastPriceUpdate || existingAsset.lastPriceUpdate < coin.last_updated) {
              existingAsset.currentPrice = parseFloat(coin.price_usd);
              existingAsset.lastPriceUpdate = coin.last_updated;
              connection.mongoManager.save(existingAsset);
            }
            continue;
          }
          let asset = new Asset();
          asset.name = coin.name;
          asset.symbol = coin.symbol;
          asset.marketCapUSD = coin.market_cap_usd;
          asset.totalAmount = 0;
          asset.currentPrice = coin.price_usd;
          asset.lastPriceUpdate = coin.last_updated;
          connection.mongoManager.save(asset);
        }
  })
  .catch(console.error);

  cryptocompare.exchangeList()
  .then(async exchangeList => {
    for(var name in exchangeList) {
      let existingExchange = await connection.mongoManager.findOne(Exchange, {name: name});
      if (existingExchange) continue;
      let exchange = new Exchange();
      exchange.name = name;
      connection.mongoManager.save(exchange);
    }
  })
  .catch(console.error);

}).catch(error => console.log("Error: ", error));
