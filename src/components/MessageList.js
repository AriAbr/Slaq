import React, { Component } from 'react';


class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      newMessageContent: "",
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

  handleMessageSubmit(e) {
    e.preventDefault();
    if (!this.state.newMessageContent) {return}
    const newMessageContent = this.state.newMessageContent;
    this.messagesRef.push({
      content: newMessageContent,
      roomId: this.props.activeRoomKey,
      sentAt: this.props.firebase.database.ServerValue.TIMESTAMP,
      username: this.props.user.displayName
    });
    this.setState({ newMessageContent: '' });
  }

  handleMessageInputChange(e) {
    this.setState({ newMessageContent: e.target.value });
  }

  render() {
    if (!this.props.activeRoomName) {
      return (
        <div>
        This is the MessageList component
          <p id="choose-room-message">Choose an existing chat room or create a new one to view and send messages</p>
        </div>
      );
    } else {
      const messages = this.state.messages
        .filter(message => message.roomId === this.props.activeRoomKey)
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
          <form onSubmit={ (e) => this.handleMessageSubmit(e) }>
            <fieldset>
              <legend>Send a Message</legend>
              <label>
                Meesage:
                <input
                  type="text"
                  id="new-message-input"
                  value={ this.state.newMessageContent }
                  onChange={ (e) => this.handleMessageInputChange(e) }
                />
              </label>
              <input type="submit" value="Submit" />
            </fieldset>
          </form>
        </div>
      );
    }
  }
}

export default MessageList
