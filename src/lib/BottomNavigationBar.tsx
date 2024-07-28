import React from 'react';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {Div, Icon} from 'react-native-magnus';

const CustomBottomNavigationBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  return (
    <Div
      row
      bg={'surfaceHighlight'}
      justifyContent="space-between"
      px={'2xl'}
      py={'md'}
      shadow="xs">
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const tabIconByLabel = (label: string) => {
          switch (label) {
            case 'Notifications':
              return 'bell';
            case 'Search':
              return 'search';
            case 'NewPost':
              return 'plus';
            case 'Profile':
              return 'user';
            default:
              return 'home';
          }
        };

        return (
          <Div
            key={label as string}
            padding-0
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            bg={options.tabBarInactiveBackgroundColor}
            p={'md'}
            rounded="circle">
            <Icon
              fontFamily="Feather"
              name={tabIconByLabel(label as string)}
              color={
                isFocused
                  ? 'textPrimary'
                  : options.tabBarInactiveTintColor || 'gray600'
              }
              fontSize={'4xl'}
            />
          </Div>
        );
      })}
    </Div>
  );
};

export default CustomBottomNavigationBar;
