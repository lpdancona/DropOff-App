// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

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
  UserTypes
};