import { app } from '@config';
import { JWTPayload } from '@types';
import { env } from '@utils';

export const verifyToken = (token: string, key: string) => {
    try {
        return verify(token, key);
    } catch (error) {
        app.log.error(error);
        return null;
    }
};

export const getUser = async (token: string): Promise<void | null> => {
    const secretKey = env.get('ACCESS_TOKEN_SECRET');

    try {
        const { data } = app.jwt.verify<JWTPayload>(token);

        // TODO: Find user based on the id in the token
    } catch (error) {
        return null;
    }
};
function verify(token: string, key: string) {
    throw new Error('Function not implemented.');
}
