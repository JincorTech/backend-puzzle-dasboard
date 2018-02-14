require('dotenv').config();
import 'reflect-metadata';

const {
  HTTP_SERVER,
  PORT,
  THROTTLER_WHITE_LIST,
  THROTTLER_INTERVAL,
  THROTTLER_MAX,
  THROTTLER_MIN_DIFF,
  ORM_ENTITIES_DIR,
  ORM_SUBSCRIBER_DIR,
  ORM_MIGRATIONS_DIR,
  API_URL,
  FRONTEND_URL,
  MONGO_URL,
  ACCESS_LOG,
  MAILJET_API_KEY,
  MAILJET_API_SECRET
} = process.env;

export default {
  app: {
    port: parseInt(PORT, 10) || 3000,
    httpServer: HTTP_SERVER || 'enabled',
    apiUrl: API_URL,
    frontendUrl: FRONTEND_URL,
    accessLog: ACCESS_LOG
  },
  throttler: {
    prefix: 'request_throttler_',
    interval: THROTTLER_INTERVAL || 1000, // time window in milliseconds
    maxInInterval: THROTTLER_MAX || 5, // max number of allowed requests from 1 IP in "interval" time window
    minDifference: THROTTLER_MIN_DIFF || 0, // optional, minimum time between 2 requests from 1 IP
    whiteList: THROTTLER_WHITE_LIST ? THROTTLER_WHITE_LIST.split(',') : [] // requests from these IPs won't be throttled
  },
  email: {
    domain: 'jincor.com',
    mailgun: {
      secret: 'key-176cd97e7ce70c9e75d826792669e53a'
    },
    mailjet: {
      apiKey: MAILJET_API_KEY,
      apiSecret: MAILJET_API_SECRET
    },
    from: {
      general: 'noreply@jincor.com',
      referral: 'partners@jincor.com'
    }
  },
  typeOrm: {
    type: 'mongodb',
    synchronize: true,
    logging: false,
    url: MONGO_URL,
    entities: [
      ORM_ENTITIES_DIR
    ],
    migrations: [
      ORM_MIGRATIONS_DIR
    ],
    subscribers: [
      ORM_SUBSCRIBER_DIR
    ]
  }
};
