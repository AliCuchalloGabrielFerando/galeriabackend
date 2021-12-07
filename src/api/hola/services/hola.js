'use strict';

/**
 * hola service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hola.hola');
