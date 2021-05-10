import { FastifyReply, FastifyRequest } from 'fastify';

const providers = {};

export const buildContext = async (
    req: FastifyRequest,
    reply: FastifyReply,
) => {
    return {
        req,
        reply,
        providers,
    };
};
