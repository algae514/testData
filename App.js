// package json used. 
// "axios": "^1.7.7",
//     "firebase": "^10.13.1",
//     "react": "^18.3.1",
//     "react-dom": "^18.3.1",
//     "react-router-dom": "^6.26.2",
    



// App.js
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, where } from 'firebase/firestore';

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCJNscGO-DgxAJo97TYzBRZN-A3fMxv5NE",
  authDomain: "tnscchat.firebaseapp.com",
  projectId: "tnscchat",
  storageBucket: "tnscchat.appspot.com",
  messagingSenderId: "643019532734",
  appId: "1:643019532734:web:e3a274d59d706adc1271ef",
  measurementId: "G-F4YNFPFB27"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const customToken = 'eyJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImV4cCI6MTcyNjQ5OTY4NywiaWF0IjoxNzI2NDk2MDg3LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1xZG5ncUB0bnNjY2hhdC5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLXFkbmdxQHRuc2NjaGF0LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiOTk2MzMwOTkwOSJ9.OHJ_roQ648Y9FkwAdjDgnyf0fWfq9ZBEGIi36USLTE95m9vJCFyDbDnewKClhHEZS57i0PU0RU6jUKN9kzMLHoLQut-oiI9mjHC6iaWvsPCjWRayoMOvuF_Sgm6BhlSL6ChITuDGse1NsMJza9betfMDQy2s50TwaQQvzmawNPY6uDJM-CgG4Bfw9rHhLYI0nRR8wuv8A4sFTgcXveGPhAHO1SEPwBb1NTgr3Valosvj_yNAo-t9R4ca4FdCXr5lcE5J-98arcNb7mhtKR6y_TgnInS424mbvruOExvj3zcP9SBgUoKVRw0pJs3lp4RBIOZO7cACYRDVnO9zZiZuww'; 

    const signIn = async () => {
      try {
        const userCredential = await signInWithCustomToken(auth, customToken);
        setUser(userCredential.user);
        console.log("User signed in:", userCredential.user.uid);
      } catch (error) {
        console.error("Error signing in:", error);
        setError(`Error signing in: ${error.message}`);
      }
    };

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        console.log("User is signed in:", currentUser.uid);
      } else {
        console.log("No user signed in, attempting to sign in");
        signIn();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Fetch user's chats
    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid)
    );

    const unsubscribeChats = onSnapshot(chatsQuery, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'direct'
      }));
      setChats(chatList);
    });

    // Fetch user's group chats
    const groupChatsQuery = query(
      collection(db, 'groupChats'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribeGroupChats = onSnapshot(groupChatsQuery, (snapshot) => {
      const groupChatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        type: 'group'
      }));
      setChats(prevChats => [...prevChats, ...groupChatList]);
    });

    return () => {
      unsubscribeChats();
      unsubscribeGroupChats();
    };
  }, [user]);

  useEffect(() => {
    if (!user || !activeChat) return;

    let messagesQuery;
    if (activeChat.type === 'direct') {
      messagesQuery = query(
        collection(db, 'chats', activeChat.id, 'messages'),
        orderBy('createdAt')
      );
    } else {
      messagesQuery = query(
        collection(db, 'groupChats', activeChat.id, 'messages'),
        orderBy('createdAt')
      );
    }

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setMessages(messageList);
    });

    return () => unsubscribe();
  }, [user, activeChat]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !activeChat) return;

    try {
      const messageData = {
        text: newMessage,
        createdAt: new Date(),
        senderId: user.uid,
        senderName: user.displayName || user.email
      };

      if (activeChat.type === 'direct') {
        await addDoc(collection(db, 'chats', activeChat.id, 'messages'), messageData);
      } else {
        await addDoc(collection(db, 'groupChats', activeChat.id, 'messages'), messageData);
      }

      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      setError(`Error sending message: ${error.message}`);
    }
  };

  const createNewChat = async (otherUserId) => {

    if (!otherUserId || otherUserId.trim() === "") {
      setError("User ID cannot be empty.");
      return;
    }

    if (otherUserId === user.uid) {
      setError("You cannot create a chat with yourself.");
      return;
    }

    try {
      const chatRef = await addDoc(collection(db, 'chats'), {
        participants: [user.uid, otherUserId],
        createdAt: new Date()
      });
  
      setActiveChat({ id: chatRef.id, type: 'direct', participants: [user.uid, otherUserId] });
    } catch (error) {
      console.error("Error creating new chat:", error);
      setError(`Error creating new chat: ${error.message}`);
    }
  };

  const createNewGroupChat = async (groupName, memberIds) => {
    try {
      const groupChatRef = await addDoc(collection(db, 'groupChats'), {
        name: groupName,
        members: [user.uid, ...memberIds],
        createdAt: new Date()
      });
      setActiveChat({ id: groupChatRef.id, type: 'group' });
    } catch (error) {
      console.error("Error creating new group chat:", error);
      setError(`Error creating new group chat: ${error.message}`);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '300px', borderRight: '1px solid #ccc', padding: '20px' }}>
        <h2>Chats</h2>
        {chats.map(chat => (
          <div 
            key={chat.id} 
            onClick={() => setActiveChat(chat)}
            style={{ cursor: 'pointer', padding: '10px', backgroundColor: activeChat?.id === chat.id ? '#e0e0e0' : 'transparent' }}
          >
{chat.type === 'direct' 
  ? `Chat with ${Array.isArray(chat.participants) ? chat.participants.find(id => id !== user.uid) || 'Unknown User' : 'Unknown User'}` 
  : chat.name}


          </div>
        ))}
        <button onClick={() => createNewChat(prompt('Enter other user ID:'))}>New Direct Chat</button>
        <button onClick={() => createNewGroupChat(prompt('Enter group name:'), prompt('Enter member IDs (comma-separated):').split(','))}>New Group Chat</button>
      </div>
      <div style={{ flex: 1, padding: '20px' }}>
        {activeChat ? (
          <>
            <h2>{activeChat.type === 'direct' ? `Chat with ${activeChat.participants.find(id => id !== user.uid)}` : activeChat.name}</h2>
            <div style={{ height: '400px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
              {messages.map(msg => (
                <div key={msg.id} style={{ marginBottom: '10px', textAlign: msg.senderId === user.uid ? 'right' : 'left' }}>
                  <strong>{msg.senderName}: </strong>
                  {msg.text}
                  <small style={{ display: 'block' }}>{msg.createdAt?.toLocaleString()}</small>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} style={{ display: 'flex' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                style={{ flex: 1, marginRight: '10px' }}
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div>Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}

export default App;
