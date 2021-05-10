import { FastifyInstance } from 'fastify';
import { env } from '@utils';
import { connect } from 'mongoose';

export const runDatabase = async (app: FastifyInstance) => {
    /**
     * Setup mongodb connection
     */
    try {
        const uri = env.get('DB_URL');

        const mongodbOptions = {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        };

        await connect(uri, mongodbOptions);
        app.log.info(`Database server ready at: ${uri}`);
    } catch (error) {
        app.log.error(error);
    }
};
