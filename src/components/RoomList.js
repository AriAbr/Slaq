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
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
  }

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
    const rooms = this.state.rooms.map( (room, index) =>
      <section className="room-name" key={index}>
        {room.name}
      </section>
    );
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
      </div>
    );
  }
}

export default RoomList
