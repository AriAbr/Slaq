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

  convertTimestamp(timestamp) {
    var d = new Date(timestamp),	// Convert the passed timestamp to milliseconds
  		yyyy = d.getFullYear(),
  		mm = ('0' + (d.getMonth() + 1)).slice(-2),	// Months are zero based. Add leading 0.
  		dd = ('0' + d.getDate()).slice(-2),			// Add leading 0.
  		hh = d.getHours(),
  		h = hh,
  		min = ('0' + d.getMinutes()).slice(-2),		// Add leading 0.
  		ampm = 'AM',
  		time;

  	if (hh > 12) {
  		h = hh - 12;
  		ampm = 'PM';
  	} else if (hh === 12) {
  		h = 12;
  		ampm = 'PM';
  	} else if (hh == 0) {
  		h = 12;
  	}
  	// ie: 2013-02-18, 8:35 AM
  	time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
  	return time;
}




  render() {
    if (!this.props.user) {
      return (
        <div>
        This is the MessageList component
          <p id="choose-room-message">Please sign in to view and send messages</p>
        </div>
      );
    } else if (!this.props.activeRoomName) {
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
              <p className="message-sentAt">{this.convertTimestamp(message.sentAt)}</p>
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
