import { Request, Response } from 'express';
import runValidation from '../../../utils/runValidation';
import deleteSchema from '../validators/delete.validator';
import deleteConfiguration from '../handlers/delete.handler';

export default async function endpointDeleteConfiguration(
  req: Request,
  res: Response
): Promise<any> {
  let validationResult = runValidation({
    payload: req.body,
    schema: deleteSchema,
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
    let result = await deleteConfiguration({ req, res });
    if (result.error?.code === "NOT_FOUND") {
      return res.status(404).json(result);
    } else if (
      result.error?.code === "PRIMARY_CONFIG" ||
      result.error?.code === "LAST_CONFIG"
    ) {
      return res.status(400).json(result);
    } else {
      res.send(result);
    }
  }
}
