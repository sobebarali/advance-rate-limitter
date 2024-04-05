import Joi from 'joi';
import { typePayload } from '../types/delete.types';

const deleteSchema = Joi.object<typePayload>({
  configurationId: Joi.string().required(),
});

export default deleteSchema;
