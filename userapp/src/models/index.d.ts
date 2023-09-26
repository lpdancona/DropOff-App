import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum UserTypes {
  PARENT = "PARENT",
  STAFF = "STAFF",
  DRIVER = "DRIVER"
}



type EagerKid = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Kid, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly parent1Email?: string | null;
  readonly parent2Email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyKid = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Kid, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name: string;
  readonly parent1Email?: string | null;
  readonly parent2Email?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Kid = LazyLoading extends LazyLoadingDisabled ? EagerKid : LazyKid

export declare const Kid: (new (init: ModelInit<Kid>) => Kid) & {
  copyOf(source: Kid, mutator: (draft: MutableModel<Kid>) => MutableModel<Kid> | void): Kid;
}

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name: string;
  readonly userType?: UserTypes | keyof typeof UserTypes | null;
  readonly unitNumber?: string | null;
  readonly streetAddress: string;
  readonly city: string;
  readonly province: string;
  readonly postalCode?: string | null;
  readonly lng: number;
  readonly lat: number;
  readonly phoneNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name: string;
  readonly userType?: UserTypes | keyof typeof UserTypes | null;
  readonly unitNumber?: string | null;
  readonly streetAddress: string;
  readonly city: string;
  readonly province: string;
  readonly postalCode?: string | null;
  readonly lng: number;
  readonly lat: number;
  readonly phoneNumber?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}