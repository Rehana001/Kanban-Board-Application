
import React, { useEffect,useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import KanbanColumn from '../components/Kanbancolumn'; 
import { useDispatch, useSelector } from 'react-redux';
import { setColumns, addTask } from '../Redux/taskSlice'; 
import { moderateScale } from 'react-native-size-matters';

const AllTasks = () => {
  const dispatch = useDispatch();
  const columns = useSelector((state) => state.tasks.columns); 
  const [loader, setLoader] = useState(false);

  useEffect(() => {
  }, [dispatch]);

  const handleAddTask = (columnId) => {
    setLoader(true); 
    const newTask = {
      name: 'New Task',
      desc: 'Task description',
      comments: [],
      attachments: [],
    };
    dispatch(addTask({ columnId, task: newTask }));
  };

  return (
    <View style={styles.container}>
       {loader && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}
      <Text style={styles.KanbanBoardTitle}>Kanban Board</Text>
      <ScrollView>
        {columns.map((column) => (
          <View key={column.id} style={styles.kanbanColumnStyle}>
            <KanbanColumn columnId={column.id} title={column.title} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default AllTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(10, 0.1),
    backgroundColor: '#e6f5e1'
  },
  KanbanBoardTitle: {
    fontSize: moderateScale(24, 0.1),
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    padding: moderateScale(10, 0.1),
    paddingTop: moderateScale(20, 0.1),
    paddingBottom: moderateScale(25, 0.1),
  },
  kanbanColumnStyle: {
    marginBottom: moderateScale(15, 0.1), // Add some margin between columns
  },
  loaderContainer:{
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
    backgroundColor: '#0000009c',
    alignItems: 'center',
    justifyContent: 'center'
  }
  
});

