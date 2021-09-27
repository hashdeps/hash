import { gql } from "apollo-server-express";

export const userTypedef = gql`
  type User implements Entity {
    # Whether the user has completed the account sign-up process
    accountSignupComplete: Boolean!

    properties: UserProperties!

    # ENTITY INTERFACE FIELDS BEGIN #
    """
    The id of the entity - alias of 'entityId'
    """
    id: ID!
    """
    The id of the entity - alias of 'id'
    """
    entityId: ID!
    """
    The specific version if of the entity
    """
    entityVersionId: ID!
    """
    The id of the account this entity belongs to
    """
    accountId: ID!
    """
    The date the entity was created
    """
    createdAt: Date!
    """
    The date this entity version was created.
    """
    entityVersionCreatedAt: Date!
    """
    The user who created the entity
    """
    createdById: ID!
    """
    The date the entity was last updated
    """
    updatedAt: Date!
    """
    The visibility level of the entity
    """
    visibility: Visibility!
    """
    The fixed id of the type this entity is of
    """
    entityTypeId: ID!
    """
    The id of the specific version of the type this entity is of
    """
    entityTypeVersionId: ID!
    """
    The name of the entity type this belongs to.
    N.B. Type names are unique by account - not globally.
    """
    entityTypeName: String!
    """
    The full entityType definition
    """
    entityType: EntityType!
    """
    The version timeline of the entity.
    """
    history: [EntityVersion!]
    """
    The metadata ID of the entity. This is shared across all versions of the same entity.
    """
    metadataId: ID!
    # ENTITY INTERFACE FIELDS END #
  }

  type Email {
    address: String!
    verified: Boolean!
    primary: Boolean!
  }

  enum WayToUseHASH {
    BY_THEMSELVES
    WITH_A_TEAM
  }

  type LinkedOrg {
    data: Org!
  }

  type MemberOfOrg {
    org: LinkedOrg!
    responsibility: String
  }

  type UserProperties {
    emails: [Email!]!
    shortname: String
    preferredName: String
    memberOf: [MemberOfOrg!]!
  }

  type VerificationCodeMetadata {
    id: ID!
    createdAt: Date!
  }

  extend type Query {
    me: User!
    """
    Determines whether a provided shortname is already taken
    """
    isShortnameTaken(shortname: String!): Boolean!
  }

  input UpdateUserProperties {
    shortname: String
    preferredName: String
    usingHow: WayToUseHASH
  }

  enum LogoutResponse {
    SUCCESS
  }

  input JoinOrgVerification {
    invitationLinkToken: String
    invitationEmailToken: String
  }

  extend type Mutation {
    """
    Creates a user, and sends them an email verification code
    """
    createUser(
      email: String!
      magicLinkQueryParams: String
    ): VerificationCodeMetadata!
    """
    Creates a the user associated with the email invitation, and sends them an email verification code
    """
    createUserWithOrgEmailInvitation(
      orgAccountId: ID!
      orgEntityId: ID!
      invitationEmailToken: String!
    ): User!
    """
    Update a user
    """
    updateUser(userEntityId: ID!, properties: UpdateUserProperties!): User!
    """
    Verifies a user's email address using a previously generated verification code
    """
    verifyEmail(verificationId: ID!, verificationCode: String!): User!
    """
    Sends an existing user a login verification code
    """
    sendLoginCode(
      emailOrShortname: String!
      redirectPath: String
    ): VerificationCodeMetadata!
    """
    Logs a user in using a previously generated verification code
    """
    loginWithLoginCode(verificationId: ID!, verificationCode: String!): User!
    logout: LogoutResponse!
    """
    Create a new organization. The user that calls this mutation is automatically added
    as a member with the provided 'role'.
    """
    joinOrg(
      orgAccountId: ID!
      orgEntityId: ID!
      verification: JoinOrgVerification!
      """
      The 'role' of the user at the organization.
      """
      responsibility: String!
    ): User!
  }
`;
