import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Button, Div, Icon, Text, ThemeContext} from 'react-native-magnus';

import HomeScreen from './Home';
import CustomBottomNavigationBar from '../lib/BottomNavigationBar';
import PostDetailsScreen from './PostDetails';
import {useNavigation} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const MainBottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomBottomNavigationBar {...props} />}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Search"
        component={() => (
          <Div>
            <Text fontSize={'xl'}>Search</Text>
          </Div>
        )}
      />
      <Tab.Screen
        name="NewPost"
        options={{
          tabBarInactiveBackgroundColor: '#A90282',
          tabBarInactiveTintColor: '#ffffff',
        }}
        component={() => (
          <Div>
            <Text fontSize={'xl'}>New Post</Text>
          </Div>
        )}
      />
      <Tab.Screen
        name="Notifications"
        component={() => (
          <Div>
            <Text fontSize={'xl'}>Notifications</Text>
          </Div>
        )}
      />

      <Tab.Screen
        name="Profile"
        component={() => (
          <Div>
            <Text fontSize={'xl'}>Profile</Text>
          </Div>
        )}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  const {theme} = useContext(ThemeContext);
  const {goBack} = useNavigation();

  return (
    <Stack.Navigator initialRouteName="HomeStack">
      <Stack.Screen
        name="HomeStack"
        component={MainBottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PostDetails"
        component={PostDetailsScreen}
        options={{
          headerTitle: 'Post',
          headerTitleStyle: {color: theme.colors?.textColor},
          headerLeft: () => {
            return (
              <Button
                bg="surface"
                p={'xs'}
                rounded="circle"
                borderColor="borderColor"
                borderWidth={1}
                onPress={goBack}>
                <Icon
                  fontFamily="Feather"
                  name="arrow-left"
                  color="textColor"
                  fontSize={'2xl'}
                />
              </Button>
            );
          },
          headerStyle: {
            backgroundColor: theme.colors?.surface,
          },
          headerShadowVisible: false,
        }}
      />
    </Stack.Navigator>
  );
};

export {MainStackNavigator};
