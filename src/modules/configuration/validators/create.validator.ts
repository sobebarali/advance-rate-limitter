import Joi from 'joi';
import { typePayload } from '../types/create.types';

const createSchema = Joi.object<typePayload>({
  requestLimits: Joi.object({
    windowMs: Joi.number().min(60000).max(3600000).required(),
    max: Joi.number().min(1).max(1000).required(),
  }).required(),
  concurrency: Joi.object({
    max: Joi.number().min(1).max(1000).required(),
  }).required(),
});

export default createSchema;