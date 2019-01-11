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
    this.messagesRef.on('child_removed', snapshot => {
      const deletedMessage = snapshot.val();
      deletedMessage.key = snapshot.key;
      const newMessagesArray = this.state.messages.filter( message => message.key !== deletedMessage.key);
      this.setState({ messages: newMessagesArray });
    });
    this.messagesRef.on('child_changed', snapshot => {
      const changedMessage = snapshot.val();
      changedMessage.key = snapshot.key;
      const newMessagesArray = this.state.messages.map(message => {
        if (message.key === changedMessage.key) {
          return changedMessage
        } else {
          return message
        }
      })
      this.setState({ messages: newMessagesArray });
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

  handleDeleteMessageClick(message, index) {
    const deleteMessageRef = this.props.firebase.database().ref(`messages/${message.key}`);
    //confirm
    if (window.confirm(`Are you sure you want to DELETE this message? This cannot be undone.`)) {
      //delete message
      deleteMessageRef.remove();
    }
  }

  handleEditMessageClick(message, index) {
    const editMessageRef = this.props.firebase.database().ref(`messages/${message.key}`);
    //prompt new message
    var newMessage = prompt(`Edit your message:`, message.content);

    // eslint-disable-next-line
    if (newMessage === message.content) {
      return;
    } else {
      console.log("edit message initiated");

      var updates = {};
      updates['/content'] = newMessage;
      return editMessageRef.update(updates);
    }
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
    // eslint-disable-next-line
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
        <div id="MessageList-component">

          <p id="signin-message">Sign in, then choose or create a room to view and send messages.</p>
        </div>
      );
    } else if (!this.props.activeRoomName) {
      return (
        <div id="MessageList-component">
          <p id="choose-room-message">Choose an existing chat room or create a new one.</p>
        </div>
      );
    } else {

      const messages = this.state.messages
        .filter(message => message.roomId === this.props.activeRoomKey)
        .map( (message, index) => {
          return (
            <div className="message" key={index}>
              <p className="message-username">{message.username}</p>
              <p className="message-sentAt">{this.convertTimestamp(message.sentAt)}</p>
              <button
                className="edit-message-button btn"
                onClick={() => this.handleEditMessageClick(message, index)}
              >
                <i className="fa fa-edit"></i>
              </button>
              <button
                className="delete-message-button btn"
                onClick={() => this.handleDeleteMessageClick(message, index)}
              >
                <i className="fa fa-remove"></i>
              </button>
              <p className="message-content">{message.content}</p>

            </div>
          );
        });
      return (
        <div id="MessageList-component">
          <h1 id="room-title">
            {this.props.activeRoomName}
          </h1>
          <section id='messages'>
            {messages}
          </section>
          <form id='message-form'>
            <fieldset>
              {/*<legend>Send a Message</legend>*/}
              {/* <label>
                 Meesage: */}
                <input
                  type="text"
                  id="new-message-input"
                  value={ this.state.newMessageContent }
                  placeholder="Send a message..."
                  onChange={ (e) => this.handleMessageInputChange(e) }
                />
              {/* </label> */}
              <button className="btn" onClick= { (e) => this.handleMessageSubmit(e) } id="send-message-button"><i className="fa fa-paper-plane"></i></button>
            </fieldset>
          </form>
        </div>
      );
    }
  }
}

export default MessageList
