import { IResolvers } from 'mercurius';

export const resolver: IResolvers = {
    Query: {
        hello: () => 'Hello, World!!!',
    },
};
