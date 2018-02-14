import { Response, Request, NextFunction } from 'express';
import * as express from 'express';
import * as TypeMoq from 'typemoq';

import { container } from '../../ioc.container';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import { Auth } from '../../middlewares/auth';
import handle from '../../middlewares/error.handler';

export const buildApp = () => {
  const newApp = express();
  newApp.use(bodyParser.json());
  newApp.use(bodyParser.urlencoded({ extended: false }));

  const server = new InversifyExpressServer(container, null, null, newApp);
  server.setErrorConfig((app) => {
    app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).send({
        statusCode: 404,
        error: 'Route is not found'
      });
    });

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => handle(err, req, res, next));
  });

  return server.build();
};

export function testAppForResetPassword() {

  return buildApp();
}
