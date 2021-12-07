module.exports = [
    { 
    method: 'POST',
    path: '/auth/local/register',
    handler: 'auth.register',
    config: {
      prefix: '',
    },
}
  ];