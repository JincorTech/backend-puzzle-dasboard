const restore = require('mongodb-restore');
import { container } from '../src/ioc.container';

beforeEach(function(done) {
  container.snapshot();

  restore({
    uri: 'mongodb://mongo:27017/portfolio-test',
    root: __dirname + '/dump/portfolio-test',
    drop: true,
    callback: function() {
      done();
    }
  });
});

afterEach(function() {
  container.restore();
});
