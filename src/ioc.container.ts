import { Container } from 'inversify';
import { interfaces, TYPE } from 'inversify-express-utils';
import { PortfolioController } from './controllers/portfolio.controller';
import config from './config';
import * as express from 'express';
import * as validation from './middlewares/request.validation';

let container = new Container();

// controllers
container.bind<interfaces.Controller>(TYPE.Controller).to(PortfolioController).whenTargetNamed('PortfolioController');

export { container };
