

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { editTask } from '../Redux/taskSlice';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Header from '../components/Header';
import { moderateScale } from 'react-native-size-matters';
import { GoogleDriveApi } from 'react-native-google-drive-api-wrapper';

const TaskDetail = ({ route, navigation }) => {
  const { columnId, task, taskIndex } = route.params; 
  const [taskName, setTaskName] = useState(task.name);
  const [taskDesc, setTaskDesc] = useState(task.desc);
  const [comments, setComments] = useState(task.comments || []);
  const [attachments, setAttachments] = useState(task.attachments || []);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const dispatch = useDispatch();

  // Google Drive setup
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const authenticate = async () => {
    try {
      const res = await GoogleDriveApi.signIn();
      setIsAuthenticated(true);
      console.log('User signed in', res);
    } catch (error) {
      console.error('Error signing in', error);
    }
  };

  const uploadToDrive = async (fileUri) => {
    if (!isAuthenticated) {
      await authenticate();
    }

    try {
      const fileMetadata = {
        name: 'Task Attachment', // Name of the file to be saved in Drive
        mimeType: 'image/jpeg', // Change this based on your file type
      };

      const fileContent = await fetch(fileUri);
      const blob = await fileContent.blob();

      const res = await GoogleDriveApi.files.create({
        metadata: fileMetadata,
        media: {
          mimeType: 'image/jpeg',
          body: blob,
        },
      });

      console.log('File uploaded to Drive', res);
    } catch (error) {
      console.error('Error uploading to Drive', error);
    }
  };

  const saveTask = () => {
    const updatedTask = { ...task, name: taskName, desc: taskDesc, comments, attachments };
    dispatch(editTask({ columnId, taskIndex, updatedTask }));
    navigation.goBack();
  };

  const addComment = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: Date.now(),
        text: newComment,
        replies: [],
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const addReply = (commentId) => {
    if (replyText.trim()) {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, { id: Date.now(), text: replyText }],
          };
        }
        return comment;
      });
      setComments(updatedComments);
      setReplyText('');
      setReplyToCommentId(null);
    }
  };

  const uploadAttachment = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        const source = response.assets[0].uri;
        setAttachments([...attachments, source]);
      }
    });
  };

  const captureImage = () => {
    launchCamera({ mediaType: 'photo', includeBase64: false }, (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        const source = response.assets[0].uri;
        setAttachments([...attachments, source]);
      }
    });
  };

  const removeAttachment = (uri) => {
    setAttachments(attachments.filter((attachment) => attachment !== uri));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: moderateScale(10, 0.1), marginBottom: moderateScale(20, 0.1) }}>
        <Header navigation={navigation} backButton={true} heading="Task Details" />
      </View>
      <Text style={styles.label}>Task Name</Text>
      <TextInput
        value={taskName}
        onChangeText={setTaskName}
        placeholder="Task Name"
        style={styles.input}
      />
      <Text style={styles.label}>Task Description</Text>
      <TextInput
        value={taskDesc}
        onChangeText={setTaskDesc}
        placeholder="Task Description"
        style={styles.input}
      />
      <Text style={styles.label}>Comments</Text>
      <TextInput
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Add a comment"
        style={styles.input}
      />
      <TouchableOpacity onPress={addComment} style={styles.ButtonStyle}>
        <Text style={styles.ButtonTextStyle}>Add Comment</Text>
      </TouchableOpacity>
     
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.commentCard}>
            <Text style={styles.comment}>{item.text}</Text>
            <Button title="Reply" onPress={() => setReplyToCommentId(item.id)} />
            {replyToCommentId === item.id && (
              <View style={styles.replyContainer}>
                <TextInput
                  value={replyText}
                  onChangeText={setReplyText}
                  placeholder="Add a reply"
                  style={styles.input}
                />
                <Button title="Add Reply" onPress={() => addReply(item.id)} />
              </View>
            )}
            <FlatList
              data={item.replies}
              renderItem={({ item: reply }) => (
                <View style={styles.replyCard}>
                  <Text style={styles.reply}>{reply.text}</Text>
                </View>
              )}
              keyExtractor={(reply) => reply.id.toString()}
            />
          </View>
        )}
        keyExtractor={(comment) => comment.id.toString()}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: moderateScale(15, 0.1) }}>
        <TouchableOpacity onPress={uploadAttachment} style={styles.ButtonStyleUpload}>
          <Text style={styles.ButtonTextStyle}>Upload Attachment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={captureImage} style={styles.ButtonStyleUpload}>
          <Text style={styles.ButtonTextStyle}>Capture Image</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => attachments.length > 0 && uploadToDrive(attachments[0])} style={styles.ButtonStyleUpload}>
          <Text style={styles.ButtonTextStyle}>Upload to Drive</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={attachments}
        renderItem={({ item }) => (
          <View style={styles.attachmentContainer}>
            <Image source={{ uri: item }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.crossButton} onPress={() => removeAttachment(item)}>
              <Text style={styles.crossButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity onPress={saveTask} style={styles.saveButtonStyle}>
        <Text style={styles.ButtonTextStyle}>Save Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#cac9f5'
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    color: 'black'
  },
  input: {
    borderColor: '#2e1121',
    color: 'black',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: moderateScale(10, 0.1),
    backgroundColor: '#f1f2da'
  },
  commentCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  comment: {
    marginBottom: 5,
    fontSize: 16,
  },
  replyContainer: {
    marginTop: 10,
    marginLeft: 10,
  },
  replyCard: {
    backgroundColor: '#e9ecef',
    borderRadius: 5,
    padding: 8,
    marginVertical: 5,
    marginLeft: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  reply: {
    fontSize: 14,
   
  },
  ButtonStyle: {
    backgroundColor: '#673ab7',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  ButtonStyleUpload: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  ButtonTextStyle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  attachmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  crossButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  crossButtonText: {
    color: 'white',
  },
  saveButtonStyle: {
    backgroundColor: '#28a745',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    marginTop: 20,
  },
});

export default TaskDetail;


