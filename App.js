import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import Sigin from './signIn';
import 'react-native-gesture-handler';
import SignUp from './signUp';
import home from './home';
import Chat from './chat';


const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name='Login' component={Sigin} />
        <Stack.Screen name='Register' component={SignUp} />
        <Stack.Screen name='Home' component={home} />
        <Stack.Screen name='chat' component={Chat}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
