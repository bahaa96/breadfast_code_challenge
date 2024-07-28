import {User} from '../domain-models';
import instance from './instance';

interface RequestFetchSingleUserArgs {
  id: number;
  options?: {
    signal?: AbortSignal;
  };
}

const requestFetchSingleUser = async ({
  id,
  options,
}: RequestFetchSingleUserArgs): Promise<{data: User}> => {
  const {data} = await instance.get(`/users/${id}`, {
    signal: options?.signal,
  });

  return {data};
};

export {requestFetchSingleUser};
