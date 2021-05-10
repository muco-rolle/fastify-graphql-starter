import { getUser } from '@utils';

export const authGuard = () => ({
    authContext(context: any) {
        return {
            identity: context.reply.request.headers.authorization,
        };
    },
    async applyPolicy(
        authDirectiveAST: any,
        root: any,
        args: any,
        context: any,
        info: any,
    ) {
        // return context.auth.identity === 'admin';
        const directiveArgs = authDirectiveAST.arguments[0];

        const accessToken = context.auth.identity;

        if (accessToken) {
            try {
                const user = await getUser(accessToken);

                /**
                 * Check first if auth_guard directive requires role,
                 * and verify if the current user has the role
                 */

                if (user) {
                    if (directiveArgs) {
                        const { value } = directiveArgs.value;

                        if (value === user?.role) {
                            context.user = user;
                        } else {
                            return new Error('ACCESS_DENIED.UNAUTHORIZED');
                        }
                    }

                    /**
                     * If the auth guard directive does not require
                     * a role and the user exist it means the user exists
                     * and trying to access his data
                     */
                    context.user = user;
                } else {
                    return new Error('ACCESS_DENIED.UNAUTHENTICATED');
                }
            } catch (error) {
                throw new Error('ACCESS_DENIED.INVALID_TOKEN');
            }
        } else {
            throw new Error('ACCESS_DENIED.NO_TOKEN_PROVIDED');
        }

        return true;
    },
    authDirective: 'auth_guard',
});
