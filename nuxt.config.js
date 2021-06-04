export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: "live-chat-app",
        htmlAttrs: {
            lang: "en"
        },
        meta: [
            { charset: "utf-8" },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            },
            { hid: "description", name: "description", content: "" }
        ],
        link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
    },

    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [
        // https://go.nuxtjs.dev/tailwindcss
        "@nuxtjs/tailwindcss"
    ],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        '@nuxtjs/axios',
        'nuxt-socket-io'
    ],
    io: {
        sockets: [
            {
                name: 'main',
                url: 'https://socketchat.tructiephd.info'
            }
        ]
    },
    axios: {
        proxy: true,
        timeout: 10000,
        credentials: true
    },
    proxy: {
        '/authProxy': {
            target: 'http://tructiephd.com/api/fe/auth',
            pathRewrite: {
                '^/authProxy': ''
            }
        }
    },
    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extend(config, ctx) {
            config.module.rules.push({
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            })
        }
    },
    server: {
        port: 3456
    }
};
