module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'ec2-52-44-31-100.compute-1.amazonaws.com'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'd4utq1i5v41ogs'),
      user: env('DATABASE_USERNAME', 'pcuwearitnxdej'),
      password: env('DATABASE_PASSWORD', '5f2347bec2fec0cdbb1fc73cc8eea3d94be46e8efe121ae602395675c9b31b63'),
      ssl: {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false), // For self-signed certificates
      },
    },
  },
});
