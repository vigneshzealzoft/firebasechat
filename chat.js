import { View, Text, FlatList, TextInput, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { useEffect } from 'react'
import { Timestamp, addDoc, collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { roomRef } from './firebaseConfig'
import { useCallback } from 'react'

export default function Chat({route}) {
    const [message,setMessage]=useState([])
    console.log("nana",route.params.uid)
    const senderData=route.params.uid
    const receiver=route.params.data
    const sender=route.params.uid.uid

    useEffect(() => {
        createRoomIfNotExist();
    }, []);

    // Function to generate a unique room ID based on the sorted user IDs
    const getRoomId = (userId1, userId2) => {
        const sortedIds = [userId1, userId2].sort();
        const roomId = sortedIds.join('-');
        return roomId;
    };

    // Function to create a room if it does not already exist
    const createRoomIfNotExist = async () => {
        try {
            // Generate room ID based on sender and receiver
            const roomId = getRoomId(sender, receiver);

            // Query Firestore to check if the room already exists
            const roomQuery = query(roomRef, where('roomId', '==', roomId));
            const roomSnapshot = await getDocs(roomQuery);

            // Check if the room already exists
            if (!roomSnapshot.empty) {
                // Room already exists, no need to create a new one
                console.log('Room already exists:', roomId);
                return;
            }

            // Create a new room since it does not exist
            await setDoc(doc(roomRef), {
                roomId,
                createdAt: Timestamp.fromDate(new Date()),
            });

            console.log('Room created:', roomId);
        } catch (error) {
            // Handle errors, such as failed Firestore operations
            console.error('Error creating room:', error);
        }
    };
    const onSend = useCallback((messages = []) => {
      if(!messages) return;
      try{
        let roomId=getRoomId(sender,receiver)
        const docRef=doc(db, 'room',roomId)
        const msgRef=collection(docRef, "messages")

        const newDoc=addDoc(msgRef,{
            uid:sender,
            text:messages,
            photoURL:senderData.photoURL,
            senderName:senderData.displayName,
            createdAt:Timestamp.fromDate(new Date())
            
        })

        console.log("new msg id:", newDoc.id)

      }catch(err){
        Alert.alert("message",err.message)
      }
    }, []);
  return (
    <View style={{flex:1}}>
        <GiftedChat
            messages={message}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: receiver.uid,
                name: receiver.name,
                avatar: receiver.photoURL
            }}
        />
    </View>
  )
}