// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const UserTypes = {
  "PARENT": "PARENT",
  "STAFF": "STAFF",
  "DRIVER": "DRIVER"
};

const { Kid, User } = initSchema(schema);

export {
  Kid,
  User,
  UserTypes
};