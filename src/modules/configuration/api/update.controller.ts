import { Request, Response } from 'express';
import runValidation from '../../../utils/runValidation';
import updateSchema from '../validators/update.validator';
import updateConfiguration from '../handlers/update.handler';

export default async function endpointUpdateConfiguration(
  req: Request,
  res: Response
): Promise<any> {
  let validationResult = runValidation({
    payload: req.body,
    schema: updateSchema,
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
    let result = await updateConfiguration({ req, res });
    res.send(result);
  }
}
