import {NestFactory} from '@nestjs/core';
import {AppModule} from './app/app.module';

require('dotenv').config();
const port = process.env.PORT || 8999;
NestFactory.create(AppModule).then(app => app.listen(port));
