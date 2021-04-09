module.exports = ({ env }) => ({
    defaultConnection: "default",
    connections: {
        default: {
            connector: "bookshelf",
            settings: {
                client: "mysql",
                host: env('DB_HOST', 'strapi-db-1.cuzk3anwssdq.us-west-1.rds.amazonaws.com'),
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