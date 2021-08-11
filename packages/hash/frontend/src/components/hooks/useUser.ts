import { useQuery } from "@apollo/client";
import { meQuery } from "../../graphql/queries/user.queries";
import { MeQuery } from "../../graphql/apiTypes.gen";

/**
 * Returns an array containing:
 *
 * [0] the authenticated user (if any)
 *
 * [1] a function to refetch the user from the API (ApolloClient will update the cache with the return)
 *
 * [2] a boolean to check if the api call is still loading
 */
export const useUser = (): [MeQuery["me"] | undefined, () => void, boolean] => {
  const { data, refetch, loading } = useQuery<MeQuery["me"]>(meQuery);

  return [data, refetch, loading];
};
