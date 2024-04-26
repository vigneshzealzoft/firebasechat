import { View, Text, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react'
import { getDocs, query, where } from 'firebase/firestore'
import { userRef } from './firebaseConfig'
import { TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

export default function Home({route}) {
    const [user,setUser]=useState([])
    const navigation =useNavigation()
    const {uid}=route.params
    console.log("me",uid)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Create a query to fetch users where 'userId' is not equal to 'uid'
                const q= query(userRef, where('uid' , '!=', uid.uid))
                // Execute the query and get the snapshot
                const querySnapshot = await getDocs(q);
                let data = [];

                // Process each document in the query snapshot
                querySnapshot.forEach(doc => {
                    data.push({ id: doc.id, ...doc.data() });
                });

                // Update the state with the fetched data
                // setUsers(data);
                // const filter=data.filter((item)=>item.uid !== uid)
                // console.log("check",filter)
                setUser(data)
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // Call the async function to fetch users
        fetchUsers();
    }, [uid, userRef]);

    const openChat=(item)=>{
        navigation.navigate("chat",{data:item,uid:uid})
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
            <Text style={{ fontSize: 14, padding: 5 }}>last message</Text>
            </View>
        </TouchableOpacity>
    )}
     />
    </View>
  )
}