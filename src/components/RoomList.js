import React, { Component } from 'react';


class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      newRoomName: "",
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
      console.log('child_removed event triggered');
      const deletedRoom = snapshot.val();
      deletedRoom.key = snapshot.key;
      const newRoomsArray = this.state.rooms.filter( room => room.key !== deletedRoom.key);
      this.setState({ rooms: newRoomsArray });
    });
  }


  // // Get a reference to our posts
  // var ref = db.ref("server/saving-data/fireblog/posts");
  //
  // // Get the data on a post that has been removed
  // ref.on("child_removed", function(snapshot) {
  //   var deletedPost = snapshot.val();
  //   console.log("The blog post titled '" + deletedPost.title + "' has been deleted");
  // });





  handleRoomSubmit(e) {
    e.preventDefault();
    if (!this.state.newRoomName) {return}
    const newRoomName = this.state.newRoomName;
    this.roomsRef.push({
      name: newRoomName
    });
    this.setState({ newRoomName: '' });
  }

  handleRoomInputChange(e) {
    this.setState({ newRoomName: e.target.value });
  }

  render() {

    var deleteButtonText = undefined;
    var roomButtonClass = undefined;
    var roomButtonOnClick = undefined;

    const rooms = this.state.rooms.map( (room, index) => {

      if (this.props.enterOrDeleteRoom === "enter") {
        deleteButtonText = "Delete a Room";
        roomButtonClass = "room-enter-button";
        roomButtonOnClick = () => this.props.handleRoomEnterClick(room, index);
      } else {
        deleteButtonText = "Cancel";
        roomButtonClass = "room-delete-button";
        roomButtonOnClick = () => this.props.handleRoomDeleteClick(room, index);
      }

      if (this.props.activeRoomKey === room.key) {
        return (
          <button
            className={roomButtonClass}
            id="active-room-button"
            key={index}
            onClick={roomButtonOnClick}
          >
            {room.name.toUpperCase()}
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
      <div>
        This is the RoomList component
        <h1 id="room-list-title">Bloc Chat</h1>
        {rooms}
        <form onSubmit={ (e) => this.handleRoomSubmit(e) }>
          <fieldset>
            <legend>Create New Chat Room</legend>
            <label>
              Name:
              <input
                type="text"
                id="new-room-input"
                value={ this.state.newRoomName }
                onChange={ (e) => this.handleRoomInputChange(e) }
              />
            </label>
            <input type="submit" value="Submit" />
          </fieldset>
        </form>
        <button
          id="delete-cancel-button"
          onClick={() => this.props.handleDeleteCancelClick()}
        >
          {deleteButtonText}
        </button>
      </div>
    );
  }
}

export default RoomList
