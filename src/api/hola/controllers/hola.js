'use strict';

/**
 *  hola controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::hola.hola');
