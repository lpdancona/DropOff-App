/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getWeekday = /* GraphQL */ `
  query GetWeekday($id: ID!) {
    getWeekday(id: $id) {
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
export const listWeekdays = /* GraphQL */ `
  query ListWeekdays(
    $filter: ModelWeekdayFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWeekdays(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncWeekdays = /* GraphQL */ `
  query SyncWeekdays(
    $filter: ModelWeekdayFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncWeekdays(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        name
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getVan = /* GraphQL */ `
  query GetVan($id: ID!) {
    getVan(id: $id) {
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
export const listVans = /* GraphQL */ `
  query ListVans(
    $filter: ModelVanFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listVans(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncVans = /* GraphQL */ `
  query SyncVans(
    $filter: ModelVanFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncVans(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getRoute = /* GraphQL */ `
  query GetRoute($id: ID!) {
    getRoute(id: $id) {
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
export const listRoutes = /* GraphQL */ `
  query ListRoutes(
    $filter: ModelRouteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRoutes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        date
        departTime
        lat
        lng
        driver
        helper
        route
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        routeVanId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncRoutes = /* GraphQL */ `
  query SyncRoutes(
    $filter: ModelRouteFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncRoutes(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
        id
        date
        departTime
        lat
        lng
        driver
        helper
        route
        status
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        routeVanId
        __typename
      }
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getKid = /* GraphQL */ `
  query GetKid($id: ID!) {
    getKid(id: $id) {
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
export const listKids = /* GraphQL */ `
  query ListKids(
    $filter: ModelKidFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listKids(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncKids = /* GraphQL */ `
  query SyncKids(
    $filter: ModelKidFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncKids(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const kidsByVans = /* GraphQL */ `
  query KidsByVans(
    $vans: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelKidFilterInput
    $limit: Int
    $nextToken: String
  ) {
    kidsByVans(
      vans: $vans
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
export const syncUsers = /* GraphQL */ `
  query SyncUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncUsers(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
      __typename
    }
  }
`;
