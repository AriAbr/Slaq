import React, { Component } from 'react';


class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
    this.messagesRef = this.props.firebase.database().ref('messages');
  }

  componentDidMount() {
    this.messagesRef.on('child_added', snapshot => {
      const message = snapshot.val();
      message.key = snapshot.key;
      this.setState({ messages: this.state.messages.concat( message ) });
    });
  }

  render() {
    const messages = this.state.messages
      .filter(message => JSON.stringify(message.roomId) === this.props.activeRoomKey)
      .map( (message, index) => {
        return (
          <div className="message" key={index}>
            <p className="message-username">{message.username}</p>
            <p className="message-content">{message.content}</p>
            <p className="message-sentAt">{message.sentAt}</p>
          </div>
        );
      });
    return (
      <div>
        <p>This is the MessageList component</p>
        <h1 id="room-title">
          {this.props.activeRoomName}
        </h1>
        <section>
          {messages}
        </section>
      </div>
    );
  }
}

export default MessageList
