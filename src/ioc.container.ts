import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { PortfolioController } from './controllers/portfolio.controller';
import { ExchangesController } from './controllers/exchanges.controller';
import { AssetsController } from './controllers/assets.controller';
import config from './config';
import * as express from 'express';
import * as validation from './middlewares/request.validation';

let container = new Container();

// controllers
container.bind<interfaces.Controller>(TYPE.Controller).to(PortfolioController).whenTargetNamed('PortfolioController');
container.bind<interfaces.Controller>(TYPE.Controller).to(ExchangesController).whenTargetNamed('ExchangesController');
container.bind<interfaces.Controller>(TYPE.Controller).to(AssetsController).whenTargetNamed('AssetsController');

export { container };
