import Fastify from 'fastify';

import mercurius from 'mercurius';
import fastifyCORS from 'fastify-cors';
import fastifyJWT from 'fastify-jwt';
import fastifyCookie from 'fastify-cookie';
import mercuriusAuth from 'mercurius-auth';

import { Providers } from '@types';
import { authGuard } from '@guards';

import {
    buildContext,
    env,
    loadGraphQLResolvers,
    loadGraphQLSchema,
    typesCodegen,
} from '@utils';

/**
 * Instantatiate fastify app
 */
export const app = Fastify({
    logger: {
        level: 'debug',
    },
    disableRequestLogging: true,
});

/**
 * Custom context types
 */
type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module 'mercurius' {
    interface MercuriusContext
        extends PromiseType<ReturnType<typeof buildContext>> {
        providers: Providers;
    }
}

export const runApp = async () => {
    const { resolvers } = loadGraphQLResolvers();
    const { schema } = loadGraphQLSchema(app, resolvers);

    const port = env.get('PORT');
    const secretKey = env.get('ACCESS_TOKEN_SECRET');

    /**
     * Register Fastify Plugins
     */
    app.register(fastifyCORS, {
        origin: '*',
    });

    app.register(fastifyJWT, {
        secret: secretKey,
    });

    app.register(fastifyCookie);

    app.register(mercurius, {
        schema,
        resolvers,
        path: '/graphql',
        context: buildContext,
        subscription: true,
        graphiql: 'playground',
        playgroundSettings: {
            'editor.cursorShape': 'line',
            'editor.fontFamily': "'Monaco', monospace",
            'editor.theme': 'dark',
            'prettier.printWidth': 80,
            'prettier.tabWidth': 4,
            'prettier.useTabs': true,
            'request.credentials': 'include',
        } as any,
    });

    app.register(mercuriusAuth, authGuard);

    typesCodegen(app);

    await app.listen(port ?? 4001);
};
