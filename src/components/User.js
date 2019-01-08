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

    this.props.firebase.auth().signInWithPopup( provider );
    // this.props.firebase.auth().signInWithRedirect(provider);

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
