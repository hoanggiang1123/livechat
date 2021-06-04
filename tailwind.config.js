module.exports = {
    mode: "jit",
    theme: {
        extend: {
            fontFamily: {
                'robo': ['Roboto']
            }
        }
    },
    variants: {},
    plugins: [],
    purge: {
        content: [
            `components/**/*.{vue,js}`,
            `layouts/**/*.vue`,
            `pages/**/*.vue`,
            `plugins/**/*.{js,ts}`,
            `nuxt.config.{js,ts}`
        ]
    }
};
