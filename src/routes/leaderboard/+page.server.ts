// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const load = async (serverLoadEvent) => {
    try {
        const { fetch } = serverLoadEvent;
        const res = await fetch(`http://localhost:3000/user/isLoggedIn`);
        const items = await res.json();
        if (!items) {
            return {
                redirect: 'http://localhost:3000/user/login',
            };
        } else {
            const response = await fetch("http://localhost:3000/user/leaderboard");
			if (response.ok) {
				const users = await response.json();
                return {
                    users: users
                }
			} else {
				console.error('Failed to fetch leaderboard data.');
			}
        }
    } catch (error) {
        return {
            error: {
                // @ts-ignore
                message: error.message || 'An unknown error occurred',
                stack: process.env.NODE_ENV === 'development'
                    // @ts-ignore
                    ? error.stack : undefined,
            },
        };
    }
};