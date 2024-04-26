import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { addDoc } from 'firebase/firestore';
import { auth, userRef } from './firebaseConfig';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');
    const navigation=useNavigation()

    const register = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            // Update user profile
            await updateProfile(user, {
                displayName: name,
                photoURL: avatar || 'https://gravatar.com/avatar/94d45dbdba988afacf30d916e7aaad69?s=200&d=mp&r=x',
            });
    
            // Save user data to Firestore
            await addDoc(userRef, {
                uid: user.uid,
                name: name,
                email: email,
                photoURL: user.photoURL,
            });
            navigation.navigate('Login')
    
            alert('Registered, please log in.');
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Input
                placeholder='Enter your name'
                label='Name'
                value={name}
                onChangeText={text => setName(text)}
            />
            <Input
                placeholder='Enter your email'
                label='Email'
                value={email}
                onChangeText={text => setEmail(text)}
            />
            <Input
                placeholder='Enter your password'
                label='Password'
                value={password} onChangeText={text => setPassword(text)}
                secureTextEntry
            />
            <Input
                placeholder='Enter your image url'
                label='Profile Picture'
                value = {avatar}
                onChangeText={text => setAvatar(text)}
            />
            <Button title='register' onPress={register} style={styles.button} />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        marginTop: 100,
    },
    button: {
        width: 370,
        marginTop: 10
    }
});

export default SignUp;