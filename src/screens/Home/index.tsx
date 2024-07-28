import React, {createRef, memo, useCallback, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import {FlashList} from '@shopify/flash-list';
import {useAllPosts} from './useAllPosts';
import {
  Avatar,
  Badge,
  Button,
  Div,
  Icon,
  ScrollDiv,
  Skeleton,
  Snackbar,
  SnackbarRef,
  Text,
} from 'react-native-magnus';
import {useSingleUserDetails} from './useSingleUserDetails';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {AxiosError} from 'axios';
import {Post} from '../../domain-models';
import {useNavigation} from '@react-navigation/native';

const ESTIMATED_ITEM_HEIGHT = 300;
const ESTIMATED_ITEM_MARGIN = 12;

const snackbarRef = createRef<SnackbarRef>();

const HomeScreen = ({navigation}: NativeStackScreenProps<any>) => {
  const {allPosts, isLoading, error, loadMorePosts, currentPage, pageSize} =
    useAllPosts();

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

  const renderItem = useCallback(({item: postData}: {item: Post}) => {
    const MemoizedUserNameComponent = memo(UserNameComponent);

    return (
      <Button
        bg="transparent"
        p={'sm'}
        onPress={() =>
          navigation.navigate('PostDetails', {postId: postData.id})
        }>
        <Div style={{gap: 14}}>
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
                <MemoizedUserNameComponent userId={postData.user_id} />
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
              {postData.title}
            </Text>
            <Text fontSize={'md'} fontWeight="500">
              {postData.body}
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
      </Button>
    );
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const _error = error as AxiosError<{
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
  }, [error]);

  return (
    <>
      <ScrollDiv
        flex={1}
        bg={'surface'}
        px={'lg'}
        py={'xl'}
        showsVerticalScrollIndicator={false}
        onScroll={({
          nativeEvent: {layoutMeasurement, contentOffset, contentSize},
        }) => {
          const paddingToBottom = ESTIMATED_ITEM_HEIGHT;
          const isEnd =
            layoutMeasurement.height + contentOffset.y >=
            contentSize.height - paddingToBottom;
          if (isEnd) {
            loadMorePosts();
          }
        }}
        scrollEventThrottle={400}>
        <Div
          row
          alignItems={'center'}
          justifyContent="space-between"
          mb={'xl'}
          px={'xs'}>
          <Text fontSize={'lg'} fontWeight={'bold'}>
            Good Morning, Alex
          </Text>
          <Button
            bg="surface"
            p={'sm'}
            rounded="circle"
            borderColor="borderColor"
            borderWidth={1}>
            <Badge
              bg="danger"
              right={-2}
              top={-2}
              h={5}
              w={5}
              borderColor="white"
              borderWidth={1}>
              <Icon
                fontFamily="Feather"
                name="mail"
                color="textColor"
                fontSize={'2xl'}
              />
            </Badge>
          </Button>
        </Div>
        {isLoading && !allPosts.length ? (
          <>
            <Div flexDir="row" mt="md">
              <Skeleton.Circle h={40} w={40} />
              <Div ml="md" flex={1}>
                <Skeleton.Box mt="sm" />
                <Skeleton.Box mt="sm" w="80%" />
                <Skeleton.Box mt="sm" />
              </Div>
            </Div>
            <Div flexDir="row" mt="md">
              <Skeleton.Circle h={20} w={20} rounded="lg" />
              <Skeleton.Circle h={20} w={20} rounded="lg" ml="md" />
              <Div alignItems="flex-end" flex={1}>
                <Skeleton.Box h={20} w={100}></Skeleton.Box>
              </Div>
            </Div>
          </>
        ) : (
          <FlashList
            data={allPosts}
            ListEmptyComponent={() => (
              <Div row justifyContent="center" alignItems="center">
                <Text>List is Empty</Text>
              </Div>
            )}
            keyExtractor={({id}) => String(id)}
            ItemSeparatorComponent={() => <Div h={1} bg="gray400" my={'lg'} />}
            estimatedItemSize={ESTIMATED_ITEM_HEIGHT + ESTIMATED_ITEM_MARGIN}
            contentContainerStyle={{
              paddingBottom: 24,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
          />
        )}
      </ScrollDiv>
      <Snackbar ref={snackbarRef} bg="danger" color="white" />
    </>
  );
};

const UserNameComponent = ({userId}: {userId: number}) => {
  const {userDetails, isLoading, error} = useSingleUserDetails({userId});

  // TODO: figure out a smooth inline error handling or retries for this component

  return (
    <Text fontSize={'md'} fontWeight="bold">
      {isLoading ? 'Loading...' : userDetails?.name || 'Jacob Washington'}
    </Text>
  );
};

const styles = StyleSheet.create({
  selfEnd: {
    alignSelf: 'flex-end',
  },
  overflowHidden: {
    overflow: 'hidden',
  },
  classCardCoverImageOverlayBackground: {
    padding: 20,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 185,
  },
});

export default HomeScreen;
