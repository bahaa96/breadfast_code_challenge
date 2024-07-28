import React, {useEffect, createRef} from 'react';
import {
  Div,
  Text,
  Avatar,
  Button,
  Icon,
  Snackbar,
  SnackbarRef,
  ScrollDiv,
  Skeleton,
} from 'react-native-magnus';
import {FlashList} from '@shopify/flash-list';

import {usePostDetails} from './usePostDetails';
import {useAllPostComments} from './useAllPostComments';
import {useSingleUserDetails} from './useSingleUserDetails';
import type {AxiosError} from 'axios';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

const ESTIMATED_ITEM_HEIGHT = 100;
const ESTIMATED_ITEM_MARGIN = 12;

const snackbarRef = createRef<SnackbarRef>();

const PostDetailsScreen = ({
  route,
}: NativeStackScreenProps<{PostDetails: {postId: number}}, 'PostDetails'>) => {
  const {postDetails, isLoadingPostDetails, postDetailsLoadingError} =
    usePostDetails({
      postId: route.params.postId,
    });
  const {
    allComments,
    loadMoreComments,
    isLoadingAllPostComments,
    postCommentsLoadingError,
  } = useAllPostComments({
    postId: route.params.postId,
  });

  const showErrorMessage = ({message}: {message: string}) => {
    if (snackbarRef.current) {
      snackbarRef.current.show(message, {
        duration: 2000,
        suffix: (
          <Icon name="info" color="white" fontSize="md" fontFamily="Feather" />
        ),
      });
    }
  };

  useEffect(() => {
    if (!postCommentsLoadingError) {
      return;
    }

    const _error = postCommentsLoadingError as AxiosError<{
      message: string | string[];
    }>;
    const status = _error?.response?.status;
    const isDomainError = _error?.response?.data;
    let errorMessage;
    if (isDomainError) {
      errorMessage = Array.isArray(_error?.response?.data.message)
        ? _error?.response?.data.message?.[0]
        : _error?.response?.data.message;
    } else {
      errorMessage =
        status === 401 ? 'Invalid credentials' : 'Service Unavailable';
    }
    showErrorMessage({message: errorMessage as string});
  }, [postCommentsLoadingError]);

  if (postDetailsLoadingError) {
    const _error = postDetailsLoadingError as AxiosError<{
      message: string | string[];
    }>;
    const status = _error?.response?.status;
    const isDomainError = _error?.response?.data;
    let errorMessage;
    if (isDomainError) {
      errorMessage = Array.isArray(_error?.response?.data.message)
        ? _error?.response?.data.message?.[0]
        : _error?.response?.data.message;
    } else {
      errorMessage =
        status === 401 ? 'Invalid credentials' : 'Service Unavailable';
    }

    return (
      <Div p={'lg'}>
        <Div row p={'lg'} bg="info" style={{gap: 10}}>
          <Icon name="info" color="white" fontSize="md" fontFamily="Feather" />
          <Text color="white" fontWeight="600">
            {errorMessage as string}
          </Text>
        </Div>
      </Div>
    );
  }

  return (
    <>
      <ScrollDiv
        flex={1}
        bg={'surface'}
        px={'lg'}
        py={'xl'}
        showsVerticalScrollIndicator={false}>
        {isLoadingPostDetails ? (
          <Text>Loading...</Text>
        ) : (
          <Div style={{gap: 14}} px={'xs'}>
            <Div row justifyContent="space-between">
              <Div row style={{gap: 10}}>
                <Avatar
                  bg="red300"
                  color="red800"
                  size={32}
                  source={{
                    uri: 'https://avatar.iran.liara.run/public',
                  }}
                />
                <Div>
                  <UserNameComponent userId={postDetails?.user_id} />
                  <Text fontSize={'sm'} fontWeight={'400'}>
                    20m ago
                  </Text>
                </Div>
              </Div>
              <Div>
                <Button bg="surface" p={'md'} rounded="circle">
                  <Icon
                    fontFamily="Feather"
                    name="more-vertical"
                    color="textColor"
                    fontSize={'xl'}
                  />
                </Button>
              </Div>
            </Div>
            <Div style={{gap: 10}}>
              <Text fontSize={'lg'} fontWeight={'600'}>
                {postDetails?.title}
              </Text>
              <Text fontSize={'md'} fontWeight="500">
                {postDetails?.body}
              </Text>
            </Div>
            <Div row justifyContent="space-between">
              <Div row alignItems="center" justifyContent="center">
                <Button
                  bg="surface"
                  p={'md'}
                  rounded="circle"
                  style={{gap: 4}}
                  prefix={
                    <Icon
                      fontFamily="Feather"
                      name="thumbs-up"
                      color="textColor"
                      fontSize={'xl'}
                    />
                  }>
                  <Text>2,245</Text>
                </Button>
                <Button
                  bg="surface"
                  p={'md'}
                  rounded="circle"
                  alignItems="center"
                  style={{gap: 4}}
                  prefix={
                    <Icon
                      fontFamily="Feather"
                      name="message-circle"
                      color="textColor"
                      fontSize={'xl'}
                    />
                  }>
                  <Text>45</Text>
                </Button>
                <Button
                  bg="surface"
                  p={'md'}
                  rounded="circle"
                  style={{gap: 4}}
                  prefix={
                    <Icon
                      fontFamily="Feather"
                      name="upload"
                      color="textColor"
                      fontSize={'xl'}
                    />
                  }>
                  <Text>124</Text>
                </Button>
              </Div>
              <Div row alignItems="center" justifyContent="center">
                <Button bg="surface" p={'md'} rounded="circle">
                  <Icon
                    fontFamily="Feather"
                    name="bookmark"
                    color="textColor"
                    fontSize={'xl'}
                  />
                </Button>
              </Div>
            </Div>
          </Div>
        )}
        <Div h={1} bg="gray400" mt={'lg'} mb={'xl'} />
        <Div flex={1} style={{gap: 24}} px={'lg'}>
          <Div row alignItems="center" justifyContent="space-between">
            <Div>
              <Text textTransform="uppercase" fontWeight="500">
                Comments (45)
              </Text>
            </Div>
            <Div>
              <Button bg="transparent" p={'sm'}>
                <Text>Recent</Text>
                <Icon
                  fontFamily="Feather"
                  name="chevron-down"
                  color="textColor"
                  fontSize={'xl'}
                />
              </Button>
            </Div>
          </Div>
          {isLoadingAllPostComments ? (
            <Text>Loading ...</Text>
          ) : (
            <Div flex={1}>
              <FlashList
                data={allComments}
                ListEmptyComponent={() => <Text>List is Empty</Text>}
                ItemSeparatorComponent={() => (
                  <Div h={1} bg="gray400" my={'lg'} />
                )}
                estimatedItemSize={
                  ESTIMATED_ITEM_HEIGHT + ESTIMATED_ITEM_MARGIN
                }
                ListFooterComponent={() => (
                  <Div row justifyContent="center" py={'lg'}>
                    <Button
                      bg="transparent"
                      p={'sm'}
                      onPress={() => loadMoreComments()}>
                      <Text fontWeight="bold">Load More Comments</Text>
                    </Button>
                  </Div>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: ESTIMATED_ITEM_MARGIN * 4,
                }}
                renderItem={({item: commentData}) => (
                  <Div row>
                    <Div row flex={1} style={{gap: 10}}>
                      <Avatar
                        bg="red300"
                        color="red800"
                        size={28}
                        source={{
                          uri: 'https://avatar.iran.liara.run/public',
                        }}
                      />
                      <Div style={{gap: 4}}>
                        <Text fontSize={'md'} fontWeight="bold">
                          {commentData.name}
                        </Text>
                        <Text fontSize={'sm'} fontWeight="500">
                          {commentData.body}
                        </Text>
                        <Text
                          fontSize={'sm'}
                          fontWeight={'400'}
                          color="infoText">
                          20m ago
                        </Text>
                      </Div>
                    </Div>
                    <Div>
                      <Button bg="surface" p={'sm'} rounded={'circle'}>
                        <Icon
                          fontFamily="Feather"
                          name="thumbs-up"
                          color="textColor"
                          fontSize={'lg'}
                        />
                      </Button>
                    </Div>
                  </Div>
                )}
              />
            </Div>
          )}
        </Div>
      </ScrollDiv>
      <Snackbar ref={snackbarRef} bg="danger" color="white" />
    </>
  );
};

const UserNameComponent = ({userId}: {userId?: number}) => {
  if (!userId) return;

  const {userDetails, isLoading, error} = useSingleUserDetails({userId});

  return (
    <Text fontSize={'md'} fontWeight="bold">
      {isLoading ? 'Loading...' : userDetails?.name || 'Jacob Washington'}
    </Text>
  );
};

export default PostDetailsScreen;
