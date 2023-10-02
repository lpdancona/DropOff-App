import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled } from "@aws-amplify/datastore";

export enum UserTypes {
  PARENT = "PARENT",
  STAFF = "STAFF",
  DRIVER = "DRIVER"
}



type EagerVan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Van, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly image?: string | null;
  readonly plate?: string | null;
  readonly model?: string | null;
  readonly year?: string | null;
  readonly seats?: string | null;
  readonly bosterSeats?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyVan = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Van, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly name?: string | null;
  readonly image?: string | null;
  readonly plate?: string | null;
  readonly model?: string | null;
  readonly year?: string | null;
  readonly seats?: string | null;
  readonly bosterSeats?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Van = LazyLoading extends LazyLoadingDisabled ? EagerVan : LazyVan

export declare const Van: (new (init: ModelInit<Van>) => Van) & {
  copyOf(source: Van, mutator: (draft: MutableModel<Van>) => MutableModel<Van> | void): Van;
}

type EagerRoute = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Route, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly van?: string | null;
  readonly date?: string | null;
  readonly departTime?: string | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly driver?: string | null;
  readonly helper?: string | null;
  readonly route?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyRoute = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Route, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly van?: string | null;
  readonly date?: string | null;
  readonly departTime?: string | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly driver?: string | null;
  readonly helper?: string | null;
  readonly route?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Route = LazyLoading extends LazyLoadingDisabled ? EagerRoute : LazyRoute

export declare const Route: (new (init: ModelInit<Route>) => Route) & {
  copyOf(source: Route, mutator: (draft: MutableModel<Route>) => MutableModel<Route> | void): Route;
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
  readonly dropOffAddress?: string | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly birthDate?: string | null;
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
  readonly dropOffAddress?: string | null;
  readonly lat?: number | null;
  readonly lng?: number | null;
  readonly birthDate?: string | null;
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
  readonly address: string;
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
  readonly address: string;
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