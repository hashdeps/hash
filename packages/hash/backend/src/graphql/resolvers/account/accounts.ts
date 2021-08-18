import { Resolver, Visibility } from "../../apiTypes.gen";
import { DbOrg, DbUser } from "../../../types/dbTypes";
import { GraphQLContext } from "../../context";

export const accounts: Resolver<
  Promise<(DbUser | DbOrg)[]>,
  {},
  GraphQLContext,
  {}
> = async (_, {}, { dataSources }) => {
  const entities = await dataSources.db.getAccountEntities();
  return entities.map((entity) => {
    return {
      ...entity,
      id: entity.entityVersionId,
      accountId: entity.accountId,
      visibility: Visibility.Public, // TODO: get from entity metadata
    } as DbUser | DbOrg;
  });
};
