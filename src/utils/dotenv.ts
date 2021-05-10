import { config } from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import { join } from 'path';
import { existsSync } from 'fs';
import { EnvTypes } from '@types';

export const env = {
    get(key: keyof EnvTypes): string {
        const envFilePath = `.env.${process.env['NODE_ENV']}`;
        const path = join(process.cwd(), envFilePath);

        /**
         * if path don't exist load env variable from the system
         * This is useful for platform like Heroku, Digital Ocean App Platform
         */
        if (!existsSync(path)) {
            return process.env[key.toUpperCase()] as string;
        }

        const envConfig = config({ path });
        dotenvExpand(envConfig);

        const envVaribale = process.env[key.toUpperCase()] as string;

        if (!envVaribale)
            throw new Error(`Env variable: ${key} does not exist.`);

        return envVaribale;
    },
};
