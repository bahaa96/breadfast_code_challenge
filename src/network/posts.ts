import {Comment, Post} from '../domain-models';
import instance from './instance';

interface RequestFetchAllPostsArgs {
  page: number;
  perPage: number;
  options?: {
    signal?: AbortSignal;
  };
}

const requestFetchAllPosts = async ({
  page,
  perPage,
  options,
}: RequestFetchAllPostsArgs): Promise<{
  data: Post[];
}> => {
  const {data} = await instance.get('/posts', {
    params: {
      page,
      per_page: perPage,
    },
    signal: options?.signal,
  });

  return {data};
};

interface RequestFetchSinglePostArgs {
  id: number;
  options?: {
    signal?: AbortSignal;
  };
}

const requestFetchSinglePost = async ({
  id,
  options,
}: RequestFetchSinglePostArgs): Promise<{data: Post}> => {
  const {data} = await instance.get(`/posts/${id}`, {
    signal: options?.signal,
  });

  return {data};
};

interface RequestFetchAllPostCommentsArgs {
  page: number;
  perPage: number;
  postId: number;
  options?: {
    signal?: AbortSignal;
  };
}

const requestFetchAllPostComments = async ({
  page,
  perPage,
  postId,
  options,
}: RequestFetchAllPostCommentsArgs): Promise<{
  data: Comment[];
}> => {
  const {data} = await instance.get(`/posts/${postId}/comments`, {
    params: {
      page,
      per_page: perPage,
    },
    signal: options?.signal,
  });

  return {data};
};

export {
  requestFetchAllPosts,
  requestFetchSinglePost,
  requestFetchAllPostComments,
};
