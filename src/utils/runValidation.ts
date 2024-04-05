import { Schema, ValidationResult } from "joi";

export default function runValidation({
  payload,
  schema,
}: {
  payload: unknown;
  schema: Schema;
}): ValidationResult {
  return schema.validate(payload, {
    allowUnknown: false, // when true, allows object to contain unknown keys which are ignored.
    convert: false,
    errors: {
      escapeHtml: false,
      render: true,
    },
    noDefaults: true,
    presence: "optional", // default presence of data in payload
    skipFunctions: true, // no functions in data
    stripUnknown: {
      arrays: false, // set to true to remove unknown items from arrays
      objects: false, // to true to remove unknown keys from objects
    },
  });
}
