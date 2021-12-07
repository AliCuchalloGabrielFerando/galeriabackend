'use strict';

/**
 * hola router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::hola.hola');
