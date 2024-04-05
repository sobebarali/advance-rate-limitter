import { Request, Response } from 'express';
import runValidation from '../../../utils/runValidation';
import getSchema from '../validators/get.validator';
import getConfiguration from '../handlers/get.handler';

export default async function endpointGetConfiguration(
  req: Request,
  res: Response
): Promise<any> {
  let validationResult = runValidation({
    payload: req.body,
    schema: getSchema,
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
    let result = await getConfiguration({ req, res });
    if (result.error?.code === 'NOT_FOUND') {
      return res.status(404).json(result);
    } else {
        res.send(result);
    }
  }
}
