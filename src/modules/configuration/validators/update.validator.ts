import Joi from "joi";
import { typePayload } from "../types/update.types";

const updateSchema = Joi.object<typePayload>({
  configurationId: Joi.string().required(),
  requestLimits: Joi.object({
    windowMs: Joi.number().min(60000).max(3600000),
    max: Joi.number().min(1).max(1000),
  }),
  concurrency: Joi.object({
    max: Joi.number().min(1).max(1000),
  }),
  isPrimary: Joi.boolean(),
});

export default updateSchema;
