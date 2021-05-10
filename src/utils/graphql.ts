import { FastifyInstance } from 'fastify';
import { buildSchema } from 'graphql';
import { IResolvers, MercuriusContext } from 'mercurius';
import mercuriusCodegen, { loadSchemaFiles } from 'mercurius-codegen';
import { mergeResolvers } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { join } from 'path';

/**
 * Load graphql schema from .gql files in modules
 * @param app
 * @param resolvers
 * @returns
 */
export const loadGraphQLSchema = (
    app: FastifyInstance,
    resolvers: IResolvers<any, MercuriusContext>,
) => {
    const { schema } = loadSchemaFiles('src/modules/**/*.gql', {
        watchOptions: {
            enabled: process.env.NODE_ENV === 'development',
            onChange(schema) {
                app.graphql.replaceSchema(buildSchema(schema.join('\n')));
                app.graphql.defineResolvers(resolvers);

                mercuriusCodegen(app, {
                    targetPath: './src/types/graphql.ts',
                    operationsGlob: './src/types/operations/*.gql',
                }).catch(console.error);
            },
        },
    });

    return { schema };
};

export const loadGraphQLResolvers = () => {
    const resolversPath = join(process.cwd(), 'src/modules/**/*.resolver.ts');
    const resolversArray = loadFilesSync(resolversPath);

    const resolvers = mergeResolvers(resolversArray);

    return { resolvers };
};
/**
 * Generate Types
 * @param app
 */
export const typesCodegen = (app: FastifyInstance) => {
    mercuriusCodegen(app, {
        targetPath: './src/types/graphql.ts',
        operationsGlob: './src/types/operations/*.gql',
        watchOptions: {
            enabled: process.env.NODE_ENV === 'development',
        },
    }).catch(console.error);
};
