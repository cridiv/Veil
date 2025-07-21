import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as passport from 'passport';
import * as session from 'express-session';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});

app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
 cookie: {
        httpOnly: true,
        secure: false, // set to true in production with HTTPS
        maxAge: 1000 * 60 * 60 * 24, // 1 day
      },
  }),
);



  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
