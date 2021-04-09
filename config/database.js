module.exports = ({ env }) => ({
    defaultConnection: "default",
    connections: {
        default: {
            connector: "bookshelf",
            settings: {
                client: "mysql",
                host: env('DB_HOST', '127.0.0.1'),
                port: env('DB_PORT', 3306),
                username: env('DB_USER', 'admin'),
                password: env('DB_PASSWORD', 'MRdb1000pro'),
                database: env('DB_DATABASE', 'my_strapi_db'),
            },
            options: {
                useNullAsDefault: true,
            },
        },
    },
});