

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, deleteTask } from '../Redux/taskSlice';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { moderateScale } from 'react-native-size-matters';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'

const KanbanColumn = ({ columnId, title }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation(); 
  const tasks = useSelector((state) => state.tasks.columns.find(column => column.id === columnId)?.tasks || []);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const addNewTask = () => {
    if (newTaskName.trim()) {
      const newTask = {
        id: Date.now(),
        name: newTaskName,
        desc: '',
        comments: [],
        attachments: [],
      };
      dispatch(addTask({ columnId, task: newTask }));
      setNewTaskName('');
    }
  };

  const deleteTaskByIndex = (index) => {
    dispatch(deleteTask({ columnId, taskIndex: index }));
  };

  const clearStorage = async () => {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');
  };

  clearStorage();

  const navigateToTaskDetail = (item, index) => {
    navigation.navigate('Tasks Detail', { columnId, task: item, taskIndex: index });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.kabanColumnStyle}>
        <TouchableOpacity onPress={toggleCollapse}>
          <Text style={styles.TitleStyle}>{title}</Text>
        </TouchableOpacity>
        <Collapsible collapsed={collapsed}>
          <ScrollView style={styles.taskListContainer}>
            {tasks.map((item, index) => (
              <View key={item.id} style={styles.newTaskItem}>
                <TouchableOpacity onPress={() => navigateToTaskDetail(item, index)} style={styles.taskItemContainer}>
                  <FontAwesomeIcon name="hand-point-right" size={20} color={'#1a0640'}/>
                  <Text style={styles.taskItemText}>{item.name}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTaskByIndex(index)}>
                  <Text style={styles.deleteTaskText}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
          <View style={styles.TasknameInputStyle}>
            <TextInput
              placeholder="Add task Name"
              value={newTaskName}
              onChangeText={setNewTaskName}
              style={styles.TextInputStyle}
            />
          </View>
          <View style={styles.AddButtonView}>
            <TouchableOpacity onPress={addNewTask} style={styles.AddTaskButton}>
              <Text style={styles.ButtonTextStyle}>Add Task</Text>
            </TouchableOpacity>
          </View>
        </Collapsible>
      </View>
    </ScrollView>
  );
};

export default KanbanColumn;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: moderateScale(10),
  },
  kabanColumnStyle: {
    marginTop: moderateScale(8, 0.1),
    padding: moderateScale(10, 0.1),
    backgroundColor: '#cac9f5',
    borderRadius: moderateScale(10, 0.1),
    marginLeft:moderateScale(8,0.1),
    marginRight:moderateScale(8,0.1)
  },
  TitleStyle: {
    fontSize: moderateScale(18, 0.1),
    fontWeight: 'bold',
    color: 'black',
  },
  taskListContainer: {
    maxHeight: moderateScale(400), // You can adjust this to control scrollable height
  },
  newTaskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f1f2da',
    padding: moderateScale(10, 0.1),
    borderRadius: moderateScale(10, 0.1),
    marginBottom: moderateScale(10, 0.1),
    borderWidth:1,
    marginTop:moderateScale(10,0.1),
    borderColor:'#2e1121'
  },
  taskItemContainer: {
    flex: 1,
    flexDirection:'row',
  },
  taskItemText: {
    fontSize: moderateScale(15, 0.1),
    color:'black',
    paddingLeft:moderateScale(10,0.1)
  },
  deleteTaskText: {
    color: 'red',
    fontSize: moderateScale(18, 0.1),
    paddingLeft: moderateScale(10, 0.1),
  },
  TasknameInputStyle: {
    paddingTop: moderateScale(10, 0.1),
    paddingBottom: moderateScale(10, 0.1),
  },
  TextInputStyle: {
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: moderateScale(10, 0.1),
    borderRadius: moderateScale(10, 0.1),
    padding: moderateScale(10, 0.1),
  },
  ButtonTextStyle: {
    color: 'white',
    fontSize: moderateScale(15, 0.1),
    textAlign: 'center',
  },
  AddTaskButton: {
    backgroundColor: '#2e074a',
    padding: moderateScale(10, 0.1),
    width: moderateScale(95, 0.1),
    borderRadius: moderateScale(15, 0.1),
  },
  AddButtonView: {
    alignItems: 'center',
  },
});
