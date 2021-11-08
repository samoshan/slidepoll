import session from 'express-session';
import connectRedis from 'connect-redis';
import Redis from 'ioredis';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { mongoose } from '@typegoose/typegoose';
import { VariantManager } from './polls/variant.manager';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SessionIoAdapter } from './websockets/ws.adapter';

async function connectToMongoDB() {
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
    })
    console.log("Established mongoDB connection");
    //mongoose.set('debug', true);
}

async function connectToRedis() {
    const RedisStore = connectRedis(session);
    const redis = new Redis({ keyPrefix: 'fyp:', lazyConnect: true });
    await redis.connect();
    console.log("Established redis connection");

    return session({
        store: new RedisStore({ client: redis }),
        name: 'session',
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false
    })
}

export default async function initApp() {

    await VariantManager.loadAll();

    await connectToMongoDB();

    const sessionSettings = await connectToRedis();

    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    
    app.useWebSocketAdapter(new SessionIoAdapter(app, sessionSettings));
    app.use(sessionSettings);

    return app;

}
