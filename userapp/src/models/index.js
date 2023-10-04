// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const RouteStatus = {
  "IN_PROGRESS": "IN_PROGRESS",
  "FINISHED": "FINISHED",
  "WAITING_TO_START": "WAITING_TO_START"
};

const UserTypes = {
  "PARENT": "PARENT",
  "STAFF": "STAFF",
  "DRIVER": "DRIVER"
};

const { Van, Route, Kid, User } = initSchema(schema);

export {
  Van,
  Route,
  Kid,
  User,
  RouteStatus,
  UserTypes
};