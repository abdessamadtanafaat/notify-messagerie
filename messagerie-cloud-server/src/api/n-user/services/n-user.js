'use strict';

/**
 * n-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::n-user.n-user');
