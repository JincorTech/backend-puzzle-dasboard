import * as chai from 'chai';
import * as factory from './test.app.factory';
require('../../../test/load.fixtures');

chai.use(require('chai-http'));
const { expect, request } = chai;

const postRequest = (customApp, url: string) => {
  return request(customApp)
    .post(url)
    .set('Accept', 'application/json');
};

const getRequest = (customApp, url: string) => {
  return request(customApp)
    .get(url)
    .set('Accept', 'application/json');
};

describe('Dashboard', () => {
  describe('GET /summary', () => {
    it('should return 200', (done) => {

      getRequest(factory.buildApp(), '/portfolio/summary').end((err, res) => {
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});
