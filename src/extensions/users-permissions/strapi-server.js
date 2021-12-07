'use strict'

const controllers = require('./controllers')

module.exports = (plugin) => {
    plugin.controllers.auth.register = controllers.auth.register

   // plugin.policies[newPolicy] = (ctx) => {};
   console.log(plugin)

    plugin.routes["content-api"].routes.push({
      method: 'POST',
      path: '/auth/local/register',
      handler: 'auth.register',
     
    });
    console.log(plugin.routes)
  
    return plugin;
  }