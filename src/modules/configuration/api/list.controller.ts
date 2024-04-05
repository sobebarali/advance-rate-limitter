import { Request, Response } from 'express';
import runValidation from '../../../utils/runValidation';
import listSchema from '../validators/list.validator';
import listConfiguration from '../handlers/list.handler';

export default async function endpointListConfiguration(
  req: Request,
  res: Response
): Promise<any> {
  let validationResult = runValidation({
    payload: req.body,
    schema: listSchema,
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
    let result = await listConfiguration({ req, res });
    res.send(result);
  }
}
