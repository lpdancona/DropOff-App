/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createWeekday = /* GraphQL */ `
  mutation CreateWeekday(
    $input: CreateWeekdayInput!
    $condition: ModelWeekdayConditionInput
  ) {
    createWeekday(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateWeekday = /* GraphQL */ `
  mutation UpdateWeekday(
    $input: UpdateWeekdayInput!
    $condition: ModelWeekdayConditionInput
  ) {
    updateWeekday(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteWeekday = /* GraphQL */ `
  mutation DeleteWeekday(
    $input: DeleteWeekdayInput!
    $condition: ModelWeekdayConditionInput
  ) {
    deleteWeekday(input: $input, condition: $condition) {
      id
      name
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const createVan = /* GraphQL */ `
  mutation CreateVan(
    $input: CreateVanInput!
    $condition: ModelVanConditionInput
  ) {
    createVan(input: $input, condition: $condition) {
      id
      name
      image
      plate
      model
      year
      seats
      bosterSeats
      Kids {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateVan = /* GraphQL */ `
  mutation UpdateVan(
    $input: UpdateVanInput!
    $condition: ModelVanConditionInput
  ) {
    updateVan(input: $input, condition: $condition) {
      id
      name
      image
      plate
      model
      year
      seats
      bosterSeats
      Kids {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteVan = /* GraphQL */ `
  mutation DeleteVan(
    $input: DeleteVanInput!
    $condition: ModelVanConditionInput
  ) {
    deleteVan(input: $input, condition: $condition) {
      id
      name
      image
      plate
      model
      year
      seats
      bosterSeats
      Kids {
        nextToken
        startedAt
        __typename
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const createRoute = /* GraphQL */ `
  mutation CreateRoute(
    $input: CreateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    createRoute(input: $input, condition: $condition) {
      id
      van
      date
      departTime
      lat
      lng
      driver
      helper
      route
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateRoute = /* GraphQL */ `
  mutation UpdateRoute(
    $input: UpdateRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    updateRoute(input: $input, condition: $condition) {
      id
      van
      date
      departTime
      lat
      lng
      driver
      helper
      route
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteRoute = /* GraphQL */ `
  mutation DeleteRoute(
    $input: DeleteRouteInput!
    $condition: ModelRouteConditionInput
  ) {
    deleteRoute(input: $input, condition: $condition) {
      id
      van
      date
      departTime
      lat
      lng
      driver
      helper
      route
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const createKid = /* GraphQL */ `
  mutation CreateKid(
    $input: CreateKidInput!
    $condition: ModelKidConditionInput
  ) {
    createKid(input: $input, condition: $condition) {
      id
      name
      parent1Email
      parent2Email
      dropOffAddress
      lat
      lng
      birthDate
      photo
      vans
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateKid = /* GraphQL */ `
  mutation UpdateKid(
    $input: UpdateKidInput!
    $condition: ModelKidConditionInput
  ) {
    updateKid(input: $input, condition: $condition) {
      id
      name
      parent1Email
      parent2Email
      dropOffAddress
      lat
      lng
      birthDate
      photo
      vans
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteKid = /* GraphQL */ `
  mutation DeleteKid(
    $input: DeleteKidInput!
    $condition: ModelKidConditionInput
  ) {
    deleteKid(input: $input, condition: $condition) {
      id
      name
      parent1Email
      parent2Email
      dropOffAddress
      lat
      lng
      birthDate
      photo
      vans
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      sub
      name
      userType
      unitNumber
      address
      lng
      lat
      phoneNumber
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      sub
      name
      userType
      unitNumber
      address
      lng
      lat
      phoneNumber
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      sub
      name
      userType
      unitNumber
      address
      lng
      lat
      phoneNumber
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
