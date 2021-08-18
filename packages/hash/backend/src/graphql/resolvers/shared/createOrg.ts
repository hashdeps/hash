import { genId } from "../../../util";
import { DbOrg } from "../../../types/dbTypes";
import {
  MutationCreateOrgArgs,
  Resolver,
  Visibility,
} from "../../apiTypes.gen";
import { GraphQLContext } from "../../context";

export const createOrg: Resolver<
  Promise<DbOrg>,
  {},
  GraphQLContext,
  MutationCreateOrgArgs
> = async (_, { shortname }, { dataSources }) => {
  const id = genId();

  const entity = await dataSources.db.createEntity({
    accountId: id,
    entityVersionId: id,
    createdById: genId(), // TODO
    type: "Org",
    properties: { shortname },
    versioned: false, // @todo: should orgs be versioned?
  });

  const org: DbOrg = {
    ...entity,
    id: entity.entityVersionId,
    accountId: entity.accountId,
    type: "Org",
    visibility: Visibility.Public, // TODO
  };

  return org;
};
