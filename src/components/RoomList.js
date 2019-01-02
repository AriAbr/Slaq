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
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
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
      </div>
    );
  }
}

export default RoomList
