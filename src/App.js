import React, { Component } from 'react';
import './App.css';
import * as firebase from 'firebase';
// import { Route } from 'react-router-dom';
import RoomList from './components/RoomList';
import MessageList from './components/MessageList';
import User from './components/User';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBOb-j5Lo1HXNvQx7c5I8xfeRAEpUFlOhQ",
  authDomain: "bloc-chat-react-814d9.firebaseapp.com",
  databaseURL: "https://bloc-chat-react-814d9.firebaseio.com",
  projectId: "bloc-chat-react-814d9",
  storageBucket: "bloc-chat-react-814d9.appspot.com",
  messagingSenderId: "717782917639"
};
firebase.initializeApp(config);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRoom: undefined,
      activeIndex: undefined,
      activeRoomKey: '',
      activeRoomName: '',
      user: undefined,
      roomButtonFunction: "enter",
      onlineUsers: [],
    };
    this.usersRef =  firebase.database().ref('users');
  }

  componentDidMount() {
    this.setState({ onlineUsers: [], user: undefined });
    this.usersRef.on('child_added', snapshot => {
      const user = snapshot.val();
      user.key = snapshot.key;
      this.setState({ onlineUsers: this.state.onlineUsers.concat( user ) });
    });
    this.usersRef.on('child_removed', snapshot => {
      const signOffUser = snapshot.val();
      signOffUser.key = snapshot.key;
      const newUsersArray = this.state.onlineUsers.filter( user => user.key !== signOffUser.key);
      this.setState({ onlineUsers: newUsersArray });
    });
    window.addEventListener("beforeunload", (ev) => {
      ev.preventDefault();
      this.signOut();
    });
  }

  setUser(user){
    if (user) {
      if (this.state.user) {
        const userRef = firebase.database().ref(`users/${this.state.user.key}`);
        userRef.remove();
      }
      // add user to list of online users in Firebase
      var newUser = this.usersRef.push({ name: user.displayName });
      user.key = newUser.key;
    }
    this.setState({ user: user });
  }

  signOut() {
    //remove user from userRef
    firebase.auth().signOut();
  }

  handleRoomEnterClick(room, index) {
    const isSameRoom = room === this.state.activeRoom;
    if (!isSameRoom) {
      this.setState({
        activeRoom: room,
        activeIndex: index,
        activeRoomKey: room.key,
        activeRoomName: room.name });
    }
  }

  handleDeleteButtonClick() {
    if (this.state.roomButtonFunction !== "delete"){
      this.setState({ roomButtonFunction: "delete" });
    } else {
      this.setState({ roomButtonFunction: "enter" });
    }
  }

  handleRenameButtonClick() {
    if (this.state.roomButtonFunction !== "rename"){
      this.setState({ roomButtonFunction: "rename" });
    } else {
      this.setState({ roomButtonFunction: "enter" });
    }
  }

  handleSpecialRoomClick(room, index) {
    const isSameRoom = room === this.state.activeRoom;
    const clickedRoomRef = firebase.database().ref(`rooms/${room.key}`);
    if (this.state.roomButtonFunction === "delete") {
      //delete the room
      if (window.confirm(`Are you sure you want to DELETE the room: "${room.name}"? This will permanently delete "${room.name}" for all participants.`)) {
        this.setState({ roomButtonFunction: "enter" });
        if (isSameRoom) {
          this.setState({
            activeRoom: undefined,
            activeRoomKey: '',
            activeIndex: undefined,
            activeRoomName: ''
          });
        }
        clickedRoomRef.remove();
      }
    } else if (this.state.roomButtonFunction === "rename") {
      // rename the room
      var newName = prompt(`Please enter a new name for ${room.name}:`);

      // eslint-disable-next-line
      if (newName == null || newName == "") {
        alert("to rename a room, you must enter a new name.")
      } else {
        this.setState({ roomButtonFunction: "enter" });
        if (isSameRoom) {
          this.setState({
            activeRoom: undefined,
            activeRoomKey: '',
            activeIndex: undefined,
            activeRoomName: ''
          });
        }
        var updates = {};
        updates['/name'] = newName;
        return clickedRoomRef.update(updates);
      }
    }
  }


  render() {

    const onlineUsers = this.state.onlineUsers.map((user, index) =>
      <p className='online-user' key={index}>{user.name}</p>
    );

    return (
      <div className="App">
        <aside>
          <h1 id="app-title">Bloc Chat</h1>
          <User
            firebase={firebase}
            setUser={(user) => this.setUser(user)}
            signOut={() => this.signOut()}
            user={this.state.user}
            usersRef={this.usersRef}
          />
          <RoomList
            firebase={firebase}
            handleRoomEnterClick={(room, index) => this.handleRoomEnterClick(room, index)}
            handleSpecialRoomClick={(room, index) => this.handleSpecialRoomClick(room, index)}
            activeRoomKey={this.state.activeRoomKey}
            handleDeleteButtonClick={() => this.handleDeleteButtonClick()}
            handleRenameButtonClick={() => this.handleRenameButtonClick()}
            roomButtonFunction={this.state.roomButtonFunction}
          />
        </aside>
        <main>
          <MessageList
            firebase={firebase}
            activeRoomKey={this.state.activeRoomKey}
            activeRoomName={this.state.activeRoomName}
            user={this.state.user}
          />
        </main>
        <section id='presence'>
          <h2 id='presence-title'>Who's online?</h2>
          <div id='user-list'>
            {onlineUsers}
          </div>
        </section>
      </div>
    );
  }
}

export default App;
