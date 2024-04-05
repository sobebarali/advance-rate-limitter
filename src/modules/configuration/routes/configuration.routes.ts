import express from 'express';

import endpointCreateConfiguration from '../api/create.controller';
import endpointGetConfiguration from '../api/get.controller';
import endpointUpdateConfiguration from '../api/update.controller';
import endpointDeleteConfiguration from '../api/delete.controller';
import endpointListConfiguration from '../api/list.controller';

const configurationRouter = express.Router();

configurationRouter.post('/configuration', endpointCreateConfiguration);
configurationRouter.get('/configuration', endpointGetConfiguration);
configurationRouter.put('/configuration', endpointUpdateConfiguration);
configurationRouter.delete('/configuration', endpointDeleteConfiguration);
configurationRouter.get('/configurations', endpointListConfiguration);

export default configurationRouter;
