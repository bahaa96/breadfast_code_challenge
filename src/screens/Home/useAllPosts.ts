import {useEffect, useReducer} from 'react';
import type {Post} from '../../domain-models';
import {requestFetchAllPosts} from '../../network';

interface State {
  isLoading: boolean;
  pageSize: number;
  pageCount: number;
  currentPage: number;
  data: Post[];
  totalCount: number;
  error: unknown;
}

type Action =
  | {
      type: 'FETCH_ALL_START';
    }
  | {
      type: 'FETCH_ALL_SUCCESS';
      data: Post[];
      totalCount: number;
    }
  | {
      type: 'FETCH_ALL_ERROR';
      error: unknown;
    }
  | {
      type: 'CHANGE_PAGE';
      page: number;
    };

type ActionHandlers = {
  [key in Action['type']]: (
    state: State,
    action: Extract<Action, {type: key}>,
  ) => State;
};

const initialState: State = {
  isLoading: false,
  pageSize: 10,
  currentPage: 1,
  totalCount: 10,
  pageCount: 1,
  data: [],
  error: null,
};

const actionHandlers: ActionHandlers = {
  FETCH_ALL_START: (state, _action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  FETCH_ALL_SUCCESS: (state, {totalCount, data}) => ({
    ...state,
    isLoading: false,
    totalCount,
    data: [...state.data, ...data],
    pageCount: Math.ceil(totalCount / state.pageSize),
  }),
  FETCH_ALL_ERROR: (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  }),
  CHANGE_PAGE: (state, {page}) => ({
    ...state,
    isLoading: true,
    currentPage: page,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
}

const useAllPosts = () => {
  const [
    {isLoading, pageSize, data, totalCount, currentPage, pageCount, error},
    dispatch,
  ] = useReducer(reducer, initialState);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({type: 'FETCH_ALL_START'});

    requestFetchAllPosts({
      page: currentPage,
      perPage: pageSize,
      options: {
        signal: controller.signal,
      },
    })
      .then(({totalCount, data}) => {
        dispatch({
          type: 'FETCH_ALL_SUCCESS',
          data,
          totalCount,
        });
      })
      .catch(error => {
        if (controller.signal.aborted) {
          return false;
        }
        dispatch({type: 'FETCH_ALL_ERROR', error});
      });
    return () => {
      controller.abort();
    };
  }, [currentPage]);

  const loadMore = () => dispatch({type: 'CHANGE_PAGE', page: currentPage + 1});

  return {
    isLoading,
    allPosts: data,
    pageSize,
    totalCount,
    pageCount,
    currentPage,
    error,
    loadMorePosts: loadMore,
  };
};

export {useAllPosts};
