import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';
import {json} from 'body-parser';
import cloneBuffer = require('clone-buffer');

require('dotenv').config();

const port = process.env.PORT || 8999;
NestFactory.create(AppModule).then(async app => {
  app.use(json({ // Need rawbody for Stripe
    verify: (req, res, buf) => {
      if (req.headers['stripe-signature'] && Buffer.isBuffer(buf)) {
        (req as any).rawBody = cloneBuffer(buf);
      }
    }
  }));
  await app.listen(port);
});
