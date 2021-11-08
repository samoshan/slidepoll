import initApp from './init';
import cookieParser from 'cookie-parser';
import { MongooseExceptionFilter } from './filters/mongoose.filter';
import { addUserIdToRequests } from './auth/auth.middleware';

async function bootstrap() {
    
    const app = await initApp();
    
    app.use(cookieParser(process.env.COOKIE_SECRET));
    app.use(addUserIdToRequests);

    app.setGlobalPrefix('/api');

    app.useGlobalFilters(new MongooseExceptionFilter());

    await app.listen(4000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
