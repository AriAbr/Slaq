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
    };
  }

  setUser(user){
    this.setState({ user: user });
  }

  handleRoomClick(room, index) {
    const isSameRoom = room === this.state.activeRoom;
    if (!isSameRoom) {
      this.setState({ activeRoom: room, activeRoomKey: room.key, activeIndex: index, activeRoomName: room.name });
    }
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
            handleRoomClick={(room, index) => this.handleRoomClick(room, index)}
            activeRoomKey={this.state.activeRoomKey}
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
