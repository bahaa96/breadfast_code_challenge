import {useEffect, useReducer} from 'react';
import type {User} from '../../domain-models';
import {requestFetchSingleUser} from '../../network';

interface State {
  isLoading: boolean;
  data: User | null;
  error: unknown;
}

type Action =
  | {
      type: 'FETCH_ALL_START';
    }
  | {
      type: 'FETCH_ALL_SUCCESS';
      data: User;
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

const useSingleUserDetails = ({userId}: {userId: number}) => {
  const [{isLoading, data, error}, dispatch] = useReducer(
    reducer,
    initialState,
  );

  useEffect(() => {
    const controller = new AbortController();

    dispatch({type: 'FETCH_ALL_START'});

    requestFetchSingleUser({
      id: userId,
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
  }, [userId]);

  return {
    isLoading,
    userDetails: data,
    error,
  };
};

export {useSingleUserDetails};
