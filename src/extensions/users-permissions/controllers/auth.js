'use strict';
const getService = name => {
  return strapi.plugin('users-permissions').service(name);
};
const crypto = require('crypto');
const _ = require('lodash');
const utils = require('@strapi/utils');
//const { getService } = require('@strapi/utils');
const {
  validateCallbackBody,
  validateRegisterBody,
  validateSendEmailConfirmationBody,
} = require('./validation/auth');

const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};


module.exports = {

  async register(ctx) {
     
  
      const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });
  
      const settings = await pluginStore.get({
        key: 'advanced',
      });
  
      if (!settings.allow_register) {
        throw new ApplicationError('Register action is currently disabled');
      }
  
      const params = {
        ..._.omit(ctx.request.body, ['confirmed', 'confirmationToken', 'resetPasswordToken']),
        provider: 'local',
      };
  
      await validateRegisterBody(params);
  
      // Throw an error if the password selected by the user
      // contains more than three times the symbol '$'.
      if (getService('user').isHashed(params.password)) {
        throw new ValidationError(
          'Your password cannot contain more than three times the symbol `$`'
        );
      }
  
      const role = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: settings.default_role } });
  
      if (!role) {
        throw new ApplicationError('Impossible to find the default role');
      }
  
      // Check if the provided email is valid or not.
      const isEmail = emailRegExp.test(params.email);
  
      if (isEmail) {
        params.email = params.email.toLowerCase();
      } else {
        throw new ValidationError('Please provide a valid email address');
      }
  
     // params.role = role.id;
      params.password = await getService('user').hashPassword(params);
  
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email: params.email },
      });
  
      if (user && user.provider === params.provider) {
        throw new ApplicationError('Email is already taken');
      }
  
      if (user && user.provider !== params.provider && settings.unique_email) {
        throw new ApplicationError('Email is already taken');
      }
  
      try {
        if (!settings.email_confirmation) {
          params.confirmed = true;
        }
  
        const user = await strapi.query('plugin::users-permissions.user').create({ data: params });
  
        const sanitizedUser = await sanitizeUser(user, ctx);
  
        if (settings.email_confirmation) {
          try {
            await getService('user').sendConfirmationEmail(sanitizedUser);
          } catch (err) {
            throw new ApplicationError(err.message);
          }
  
          return ctx.send({ user: sanitizedUser });
        }
  
        const jwt = getService('jwt').issue(_.pick(user, ['id']));
  
        return ctx.send({
          jwt,
          user: sanitizedUser,
        });
      } catch (err) {
        if (_.includes(err.message, 'username')) {
          throw new ApplicationError('Username already taken');
        } else {
          throw new ApplicationError('Email already taken');
        }
      }
   
  }


};
