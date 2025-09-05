import Joi from 'joi';

export const validateRegistration = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    })
  });

  return schema.validate(data);
};

export const validateLogin = (data: any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email'
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
  });

  return schema.validate(data);
};

export const validateYieldFilter = (data: any) => {
  const schema = Joi.object({
    category: Joi.string().valid('lending', 'dex', 'yield-farming', 'liquid-staking'),
    minApy: Joi.number().min(0).max(1000),
    riskLevel: Joi.string().valid('low', 'medium', 'high'),
    sortBy: Joi.string().valid('apy', 'tvl', 'risk', 'popularity')
  });

  return schema.validate(data);
};

export const validatePortfolioPosition = (data: any) => {
  const schema = Joi.object({
    platform: Joi.string().required().messages({
      'string.empty': 'Platform is required'
    }),
    token: Joi.string().required().messages({
      'string.empty': 'Token is required'
    }),
    amount: Joi.number().positive().required().messages({
      'number.positive': 'Amount must be positive',
      'any.required': 'Amount is required'
    }),
    initialValue: Joi.number().positive().required(),
    apy: Joi.number().min(0).required()
  });

  return schema.validate(data);
};
