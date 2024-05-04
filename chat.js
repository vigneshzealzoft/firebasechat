import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export default function ChatScreen({ route }) {
    const { data, uid } = route.params;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const roomId = getRoomId(uid.uid, data.uid);
        const roomMessagesRef = collection(db, 'rooms', roomId, 'messages');

        // Subscribe to the chat messages
        const unsubscribe = onSnapshot(query(roomMessagesRef, orderBy('timestamp', 'desc')), (snapshot) => {
            const newMessages = snapshot.docs.map(doc => ({
                _id: doc.id,
                text: doc.data().text,
                createdAt: new Date(doc.data().timestamp),
                user: {
                    _id: doc.data().sender,
                    name: uid.uid === doc.data().sender ? 'You' : data.name,
                },
            }));
            setMessages(newMessages);
        });

        // Unsubscribe from snapshot listener when component unmounts
        return () => unsubscribe();
    }, [uid, data]);

    const onSend = async (newMessages) => {
        const roomId = getRoomId(uid.uid, data.uid);
        const roomMessagesRef = collection(db, 'rooms', roomId, 'messages');

        for (const message of newMessages) {
            await addDoc(roomMessagesRef, {
                text: message.text,
                sender: uid.uid,
                timestamp: new Date().toISOString(),
            });
        }
    };

    return (
        <View style={styles.container}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{ _id: uid.uid }}
            />
        </View>
    );
}

const getRoomId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 50,
    },
});
