import Joi from 'joi';
import { typePayload } from '../types/get.types';

const getSchema = Joi.object<typePayload>({
  configurationId: Joi.string().required(),
  isPrimary: Joi.boolean(),
});

export default getSchema;
