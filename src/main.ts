import { app, runApp, runDatabase } from '@config';

const bootstrap = async () => {
    try {
        await runApp();
        await runDatabase(app);
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

bootstrap();
