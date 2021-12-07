module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '3a90448a12a3d593306123571f490459'),
  },
});
