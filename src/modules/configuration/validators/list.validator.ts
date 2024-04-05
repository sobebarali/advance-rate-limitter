import Joi from "joi";
import { typePayload } from "../types/list.types";

const listSchema = Joi.object<typePayload>({
  perPage: Joi.number(),
  lastKnown: Joi.string(),
  sortOrder: Joi.string(),
});

export default listSchema;
