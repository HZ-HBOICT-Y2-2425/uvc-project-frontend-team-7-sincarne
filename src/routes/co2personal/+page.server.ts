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
            const response = await fetch("http://localhost:3000/user/co2personal");
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                return {
                    userCO2Saved: data.co2Saved
                };
            } else {
                console.error("Failed to fetch global CO2 data:", await response.text());
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