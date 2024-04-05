import { Request, Response } from 'express';
import runValidation from '../../../utils/runValidation';
import createSchema from '../validators/create.validator';
import createConfiguration from '../handlers/create.handler';

export default async function endpointCreateConfiguration(
  req: Request,
  res: Response
): Promise<any> {
  let validationResult = runValidation({
    payload: req.body,
    schema: createSchema,
  });

  if (typeof validationResult.error !== 'undefined') {
    return res.status(400).json({
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: validationResult.error.details[0].message,
      },
    });
  } else {
    let result = await createConfiguration({ req, res });
    res.status(201).send(result);
  }
}
