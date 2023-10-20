/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAddressList = /* GraphQL */ `
  subscription OnCreateAddressList(
    $filter: ModelSubscriptionAddressListFilterInput
  ) {
    onCreateAddressList(filter: $filter) {
      id
      order
      latitude
      longitude
      routeID
      Kid {
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
        __typename
      }
      createdAt
      updatedAt
      addressListKidId
      __typename
    }
  }
`;
export const onUpdateAddressList = /* GraphQL */ `
  subscription OnUpdateAddressList(
    $filter: ModelSubscriptionAddressListFilterInput
  ) {
    onUpdateAddressList(filter: $filter) {
      id
      order
      latitude
      longitude
      routeID
      Kid {
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
        __typename
      }
      createdAt
      updatedAt
      addressListKidId
      __typename
    }
  }
`;
export const onDeleteAddressList = /* GraphQL */ `
  subscription OnDeleteAddressList(
    $filter: ModelSubscriptionAddressListFilterInput
  ) {
    onDeleteAddressList(filter: $filter) {
      id
      order
      latitude
      longitude
      routeID
      Kid {
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
        __typename
      }
      createdAt
      updatedAt
      addressListKidId
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
        __typename
      }
      createdAt
      updatedAt
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
        __typename
      }
      createdAt
      updatedAt
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
        __typename
      }
      createdAt
      updatedAt
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
        __typename
      }
      status
      Kids {
        nextToken
        __typename
      }
      AddressLists {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
        __typename
      }
      status
      Kids {
        nextToken
        __typename
      }
      AddressLists {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
        __typename
      }
      status
      Kids {
        nextToken
        __typename
      }
      AddressLists {
        nextToken
        __typename
      }
      createdAt
      updatedAt
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
      email
      unitNumber
      address
      lng
      lat
      phoneNumber
      userType
      photo
      pushToken
      createdAt
      updatedAt
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
      email
      unitNumber
      address
      lng
      lat
      phoneNumber
      userType
      photo
      pushToken
      createdAt
      updatedAt
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
      email
      unitNumber
      address
      lng
      lat
      phoneNumber
      userType
      photo
      pushToken
      createdAt
      updatedAt
      __typename
    }
  }
`;
