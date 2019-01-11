import React, { Component } from 'react';


class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
    };
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    this.setState({ rooms: [] });
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
    this.roomsRef.on('child_removed', snapshot => {
      const deletedRoom = snapshot.val();
      deletedRoom.key = snapshot.key;
      const newRoomsArray = this.state.rooms.filter( room => room.key !== deletedRoom.key);
      this.setState({ rooms: newRoomsArray });
    });
    this.roomsRef.on('child_changed', snapshot => {
      const changedRoom = snapshot.val();
      changedRoom.key = snapshot.key;
      const newRoomsArray = this.state.rooms.map(room => {
        if (room.key === changedRoom.key) {
          return changedRoom
        } else {
          return room
        }
      })
      this.setState({ rooms: newRoomsArray });
    });
  }

  handleCreateButtonClick() {
    const newRoomName = prompt(`Enter name for your room:`);
    // eslint-disable-next-line
    if (newRoomName == null || newRoomName == "") {
      alert("To create a new room, you must give it a name.")
    } else {
      this.roomsRef.push({
        name: newRoomName
      });
    }
  }

  render() {

    var deleteButtonText = "Delete";
    var renameButtonText = "Rename";
    var roomButtonClass = "room-enter-button";
    var roomButtonOnClick = undefined;

    const rooms = this.state.rooms.map( (room, index) => {

      if (this.props.roomButtonFunction === "enter") {
        roomButtonOnClick = () => this.props.handleRoomEnterClick(room, index);
      } else {
        roomButtonClass = `room-${this.props.roomButtonFunction}-button`;
        roomButtonOnClick = () => this.props.handleSpecialRoomClick(room, index);
        if (this.props.roomButtonFunction === "delete") {
          deleteButtonText = "CANCEL";
        } else if (this.props.roomButtonFunction === "rename") {
          renameButtonText = "CANCEL";
        }
      }

      if (this.props.activeRoomKey === room.key) {
        return (
            <button
              className={roomButtonClass}
              id="active-room-button"
              key={index}
              onClick={roomButtonOnClick}
            >
              {room.name}
            </button>
        );
      } else {
        return (
            <button
              className={roomButtonClass}
              key={index}
              onClick={roomButtonOnClick}
            >
              {room.name}
            </button>
        );
      }
    });

    return (
      <div id="RoomsList-component">
        <h3 id='room-list-title'>Rooms</h3>
        {rooms}
        <div id="room-action-buttons-buffer"/>
        <section id="room-action-buttons">
          <h3 id='room-actions-title'>Room Actions</h3>
            <button
              id="create-room-button"
              className="room-action-button"
              onClick={() => this.handleCreateButtonClick()}
            >
              Create
            </button>
            <button
              id="rename-room-button"
              className="room-action-button"
              onClick={() => this.props.handleRenameButtonClick()}
            >
              {renameButtonText}
            </button>
            <button
              id="delete-cancel-button"
              className="room-action-button"
              onClick={() => this.props.handleDeleteButtonClick()}
            >
              {deleteButtonText}
            </button>
        </section>
      </div>
    );
  }
}

export default RoomList
