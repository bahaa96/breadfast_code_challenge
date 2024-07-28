import {useEffect, useReducer} from 'react';
import type {Post} from '../../domain-models';
import {requestFetchSinglePost} from '../../network';

interface State {
  isLoading: boolean;
  data: Post | null;
  error: unknown;
}

type Action =
  | {
      type: 'FETCH_ALL_START';
    }
  | {
      type: 'FETCH_ALL_SUCCESS';
      data: Post;
    }
  | {
      type: 'FETCH_ALL_ERROR';
      error: unknown;
    };

type ActionHandlers = {
  [key in Action['type']]: (
    state: State,
    action: Extract<Action, {type: key}>,
  ) => State;
};

const initialState: State = {
  isLoading: false,
  data: null,
  error: null,
};

const actionHandlers: ActionHandlers = {
  FETCH_ALL_START: (state, _action) => ({
    ...state,
    isLoading: true,
    error: null,
  }),
  FETCH_ALL_SUCCESS: (state, {data}) => ({
    ...state,
    isLoading: false,
    data,
  }),
  FETCH_ALL_ERROR: (state, {error}) => ({
    ...state,
    isLoading: false,
    error,
  }),
};

function reducer(state: State = initialState, action: Action): State {
  return actionHandlers[action.type]?.(state, action as any) || state;
}

const usePostDetails = ({postId}: {postId: number}) => {
  const [{isLoading, data, error}, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    const controller = new AbortController();

    dispatch({type: 'FETCH_ALL_START'});

    requestFetchSinglePost({
      id: postId,
      options: {
        signal: controller.signal,
      },
    })
      .then(({data}) => {
        dispatch({
          type: 'FETCH_ALL_SUCCESS',
          data,
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
  }, [postId]);

  return {
    isLoadingPostDetails: isLoading,
    postDetails: data,
    postDetailsLoadingError: error,
  };
};

export {usePostDetails};
