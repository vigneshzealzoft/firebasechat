import { View, Text, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { collection, getDocs, onSnapshot, orderBy, query, where } from 'firebase/firestore'
import { db, userRef } from './firebaseConfig'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Home({route}) {
    const [user,setUser]=useState([])
    const [lastMessage,setLastMessage]=useState(undefined)
    const navigation =useNavigation()
    const {uid}=route.params
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Create a query to fetch users where 'uid' is not equal to 'uid'
                const q = query(userRef, where('uid', '!=', uid.uid));
                // Execute the query and get the snapshot
                const querySnapshot = await getDocs(q);
                let data = [];
    
                // Process each document in the query snapshot
                querySnapshot.forEach(doc => {
                    data.push({ id: doc.id, ...doc.data() });
                });
    
                setUser(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
    
        // Fetch the last message only if users have been loaded
        const fetchLastMessage = () => {
            if (user.length > 0) {
                const roomId = getRoomId(uid.uid, user[0].uid);
                // console.log("room", roomId);
                const roomMessagesRef = collection(db, 'rooms', roomId, 'messages');
    
                // Subscribe to the chat messages
                const unsubscribe = onSnapshot(query(roomMessagesRef, orderBy('timestamp', 'desc')), (snapshot) => {
                    const newMessages = snapshot.docs.map(doc => doc.data());
                    // Set the last message to the first message in the ordered list
                    setLastMessage(newMessages[0] || null);
                });
    
                // Unsubscribe from snapshot listener when component unmounts
                return () => unsubscribe();
            }
        };
    
        // Call the async function to fetch users
        fetchUsers();
        
        // Call the function to fetch the last message after users are loaded
        fetchLastMessage();
    }, [uid, user]);
    
    // You could also move fetchLastMessage to its own useEffect that depends on `user` state.
    

    // console.log("lastmessage",lastMessage)
   

    const openChat=(item)=>{
        navigation.navigate("chat",{data:item,uid:uid})
    }
const renderlastMesage=()=>{
  if(lastMessage){
        const last=lastMessage.sender===uid.uid?"you:"+lastMessage.text:lastMessage.text
        // console.log(last)
        return last

    }
}

  return (
    <View style={{flex:1}}>
     <FlatList
     data={user}
     contentContainerStyle={{flex:1,paddingVertical:25}}
     keyExtractor={item=>Math.random()}
     showsVerticalScrollIndicator={false}
     renderItem={({ item }) => (
        <TouchableOpacity
            style={{ marginVertical: 10, marginHorizontal: 10, backgroundColor: "skyblue",flexDirection:"row",alignItems:"center",gap:5 }}
            onPress={()=>openChat(item)}
        >
            <Image source={{uri:item.photoURL}} style={{height:100,width:100,borderRadius:50}}/>
            <View>
            <Text style={{ fontSize: 20, padding: 10 }}>{item.name}</Text>
            {/* Display the latest message */}
            <Text style={{ fontSize: 14, padding: 5 }}>{renderlastMesage()}</Text>
            </View>
        </TouchableOpacity>
    )}
     />
    </View>
  )
}

const getRoomId = (uid1, uid2) => {
    return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};