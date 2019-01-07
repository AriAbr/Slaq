import React, { Component } from 'react';


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: undefined,
    };
  }

  signInPopup(){
    const provider = new this.props.firebase.auth.GoogleAuthProvider();
    //force choose account popup
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    this.props.firebase.auth().signInWithPopup( provider )
    .then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      // ...
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    });
  }

  signOut() {
    this.props.firebase.auth().signOut();
  }

  componentDidMount() {
    this.props.firebase.auth().onAuthStateChanged ( user => {
      this.props.setUser(user);
    });
  }

  render() {
    var welcomeMessage="";
    var buttonLabel="";
    if (!this.props.user) {
      welcomeMessage="Hello, Guest";
      buttonLabel="Sign In";
    } else {
      welcomeMessage=`Hello, ${this.props.user.displayName}`;
      buttonLabel="Switch Accounts";
    }

    return (
      <div>
        This is the User component
        <p id="welcome-message">{welcomeMessage}</p>
        <button
          id="signin-button"
          onClick={ () => this.signInPopup() }
        >
          {buttonLabel}
        </button>
        <button
          id="signout-button"
          onClick={ () => this.signOut() }
        >
          Sign Out
        </button>
      </div>
    );
  }
}

export default User
