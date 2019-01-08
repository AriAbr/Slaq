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
      enterOrDeleteRoom: "enter"
    };
  }

  setUser(user){
    this.setState({ user: user });
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

  handleDeleteCancelClick() {
    if (this.state.enterOrDeleteRoom === "enter"){
      this.setState({ enterOrDeleteRoom: "delete" });
    } else {
      this.setState({ enterOrDeleteRoom: "enter" });
    }
  }

  handleRoomDeleteClick(room, index) {
    const isSameRoom = room === this.state.activeRoom;
    const roomDeleteRef = firebase.database().ref(`rooms/${room.key}`);

    if (window.confirm("Are you sure you want to delete this room? This cannot be undone.")) {
      console.log(`delete confirm executed`);
      this.setState({ enterOrDeleteRoom: "enter" });
      if (isSameRoom) {
        this.setState({
          activeRoom: undefined,
          activeRoomKey: '',
          activeIndex: undefined,
          activeRoomName: '' });
      }
      roomDeleteRef.remove();
    }

    // console.log(firebase.database().ref(`rooms/${room.key}`));
    //firebase.remove(`rooms/${room.key}`);
    //confirmation/warning popup

  }

  render() {
    return (
      <div className="App">
        This is the App div
        <aside>
          <User
            firebase={firebase}
            setUser={(user) => this.setUser(user)}
            user={this.state.user}
          />
          <RoomList
            firebase={firebase}
            handleRoomEnterClick={(room, index) => this.handleRoomEnterClick(room, index)}
            handleRoomDeleteClick={(room, index) => this.handleRoomDeleteClick(room, index)}
            activeRoomKey={this.state.activeRoomKey}
            handleDeleteCancelClick={() => this.handleDeleteCancelClick()}
            enterOrDeleteRoom={this.state.enterOrDeleteRoom}
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
      </div>
    );
  }
}

export default App;
