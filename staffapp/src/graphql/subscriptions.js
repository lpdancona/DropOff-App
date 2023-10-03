/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateWeekday = /* GraphQL */ `
  subscription OnCreateWeekday($filter: ModelSubscriptionWeekdayFilterInput) {
    onCreateWeekday(filter: $filter) {
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
export const onUpdateWeekday = /* GraphQL */ `
  subscription OnUpdateWeekday($filter: ModelSubscriptionWeekdayFilterInput) {
    onUpdateWeekday(filter: $filter) {
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
export const onDeleteWeekday = /* GraphQL */ `
  subscription OnDeleteWeekday($filter: ModelSubscriptionWeekdayFilterInput) {
    onDeleteWeekday(filter: $filter) {
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
export const onCreateVan = /* GraphQL */ `
  subscription OnCreateVan($filter: ModelSubscriptionVanFilterInput) {
    onCreateVan(filter: $filter) {
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
export const onUpdateVan = /* GraphQL */ `
  subscription OnUpdateVan($filter: ModelSubscriptionVanFilterInput) {
    onUpdateVan(filter: $filter) {
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
export const onDeleteVan = /* GraphQL */ `
  subscription OnDeleteVan($filter: ModelSubscriptionVanFilterInput) {
    onDeleteVan(filter: $filter) {
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
export const onCreateRoute = /* GraphQL */ `
  subscription OnCreateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onCreateRoute(filter: $filter) {
      id
      date
      departTime
      lat
      lng
      driver
      helper
      route
      Van {
        id
        name
        image
        plate
        model
        year
        seats
        bosterSeats
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      status
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
      routeVanId
      __typename
    }
  }
`;
export const onUpdateRoute = /* GraphQL */ `
  subscription OnUpdateRoute($filter: ModelSubscriptionRouteFilterInput) {
    onUpdateRoute(filter: $filter) {
      id
      date
      departTime
      lat
      lng
      driver
      helper
      route
      Van {
        id
        name
        image
        plate
        model
        year
        seats
        bosterSeats
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      status
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
      routeVanId
      __typename
    }
  }
`;
export const onDeleteRoute = /* GraphQL */ `
  subscription OnDeleteRoute($filter: ModelSubscriptionRouteFilterInput) {
    onDeleteRoute(filter: $filter) {
      id
      date
      departTime
      lat
      lng
      driver
      helper
      route
      Van {
        id
        name
        image
        plate
        model
        year
        seats
        bosterSeats
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      status
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
      routeVanId
      __typename
    }
  }
`;
export const onCreateKid = /* GraphQL */ `
  subscription OnCreateKid($filter: ModelSubscriptionKidFilterInput) {
    onCreateKid(filter: $filter) {
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
      routeID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onUpdateKid = /* GraphQL */ `
  subscription OnUpdateKid($filter: ModelSubscriptionKidFilterInput) {
    onUpdateKid(filter: $filter) {
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
      routeID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onDeleteKid = /* GraphQL */ `
  subscription OnDeleteKid($filter: ModelSubscriptionKidFilterInput) {
    onDeleteKid(filter: $filter) {
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
      routeID
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
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
