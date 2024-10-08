import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import TodoListScreen from '../screens/TodoListScreen';
import InProgressScreen from '../screens/InProgressScreen';
import DoneScreens from '../screens/DoneScreens';
import AllTasks from '../screens/AllTasks';
import CreateTask from '../screens/CreateTask';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="AllTasks">
    <Drawer.Screen 
        name="Tasks List" 
        component={AllTasks}
        options={{ drawerLabel: 'All Tasks' }} 
      />
    <Drawer.Screen 
        name="To do List" 
        component={TodoListScreen} 
        options={{ drawerLabel: 'To Do List' ,}} 
      />
       <Drawer.Screen 
        name="Tasks in Progress" 
        component={InProgressScreen} 
        options={{ drawerLabel: 'Tasks in progress' }} 
      />
       <Drawer.Screen 
        name="CreateTask" 
        component={CreateTask} 
        options={{ drawerLabel: 'Create Task' }} 
      />
     <Drawer.Screen 
        name="Tasks done" 
        component={DoneScreens} 
        options={{ drawerLabel: 'Done Tasks' }} 
      />
  </Drawer.Navigator>
  )
}

export default DrawerNavigator

