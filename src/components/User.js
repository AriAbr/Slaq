import React, { Component } from 'react';


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }

  signInPopup(){
    //sign in to new account
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    //force choose account popup
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    this.props.firebase.auth().signInWithPopup( provider )
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged ( user => {
      if (this.props.user) {
        const userRef = this.props.firebase.database().ref(`users/${this.props.user.key}`);
        userRef.remove();
      }
      this.props.setUser(user);
    });
  }

  render() {
    var welcomeMessage="";
    var buttonLabel="";
    if (!this.props.user) {
      welcomeMessage="Hi, Guest!";
      buttonLabel="Sign In";
    } else {
      welcomeMessage=`Hi, ${this.props.user.displayName}!`;
      buttonLabel="Not You?";
    }

    var logoutButton = <></>
    if(this.props.user){
      logoutButton = <button
                        id="signout-button"
                        className="account-button"
                        onClick={ () => this.props.signOut() }
                      >
                        Sign Out
                      </button>
    }

    return (
      <div id="user-div" className="padded-room-element">
        <p id="welcome-message">{welcomeMessage}</p>
        <button
          id="signin-button"
          className="account-button"
          onClick={ () => this.signInPopup() }
        >
          {buttonLabel}
        </button>
        {logoutButton}
      </div>
    );
  }
}

export default User
