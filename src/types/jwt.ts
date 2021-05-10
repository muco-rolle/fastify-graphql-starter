import { Role } from '@types';

export type JWTPayload = {
    data: {
        userId: string;
        role: Role;
    };
};
