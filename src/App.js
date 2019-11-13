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
    };
  }

  componentDidMount() {
    var fakeThis = this;
    //set roomButtonFunction to "enter" when clicking away from special buttons
    document.getElementById('root').addEventListener("click", function(e){
      var path = e.path || (e.composedPath && e.composedPath());
      var willResetToEnter = (fakeThis.state.roomButtonFunction === 'delete' && !["room-delete-button"].includes(path[0].className)) || (fakeThis.state.roomButtonFunction === 'rename' && !["room-rename-button"].includes(path[0].className))
      if(willResetToEnter){
        fakeThis.setState({ roomButtonFunction: "enter" });
      }
    });
  }

  setUser(user){
    if (user) {
      if (this.state.user) {
        const userRef = firebase.database().ref(`users/${this.state.user.key}`);
        userRef.remove();
      }
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

  setRoomButtonsToEnter(callback){
    this.setState({ roomButtonFunction: "enter" }, () => {
      if(callback){
        callback();
      }
    })
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
      } else {
        this.setState({ roomButtonFunction: "enter" });
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

    return (
      <div className="App" id="App">
        <aside>
          <div id="aside-child">
            <h1 id="app-title" className="padded-room-element">Slaq</h1>
            <User
              firebase={firebase}
              setUser={(user) => this.setUser(user)}
              signOut={() => this.signOut()}
              user={this.state.user}
            />
            <RoomList
              firebase={firebase}
              handleRoomEnterClick={(room, index) => this.handleRoomEnterClick(room, index)}
              handleSpecialRoomClick={(room, index) => this.handleSpecialRoomClick(room, index)}
              activeRoomKey={this.state.activeRoomKey}
              handleDeleteButtonClick={() => this.handleDeleteButtonClick()}
              handleRenameButtonClick={() => this.handleRenameButtonClick()}
              setRoomButtonsToEnter={(callback) => this.setRoomButtonsToEnter(callback)}
              roomButtonFunction={this.state.roomButtonFunction}
              user={this.state.user}
            />
          </div>
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
