import React, { Component } from "react";
import { ChatManager, TokenProvider } from "@pusher/chatkit-client";

import MessageList from "./components/MessageList";
import NewRoomForm from "./components/NewRoomForm";
import RoomList from "./components/RoomList";
import SendMessageForm from "./components/SendMessageForm";

const tokenUrl =
  "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/d40f8f1e-5a02-46b1-a8d6-05c78761c5ba/token";

const instanceLocator = "v1:us1:064db932-7644-4ec5-9954-a25a8f8dd9f1";

class App extends Component {
  constructor() {
    super();
    this.state = {
      roomId: null,
      messages: [],
      joinableRooms: [],
      joinedRooms: []
  };
    this._sendMessage    = this._sendMessage.bind(this);
    this.getRooms        = this.getRooms.bind(this);
    this.subscribeToRoom = this.subscribeToRoomoms.bind(this);
    this.createRoom      = this.createRoom.bind(this);
  }
  componentDidMount() {
    const chatManager = new ChatManager({
      instanceLocator,
      userId: "charlosky",
      tokenProvider: new TokenProvider({ url: tokenUrl })
    });
    chatManager
      .connect()
      .then(currentUser => {
        this.currentUser = currentUser;
      })
      .catch(err => {
        console.log("Error on connection", err);
      });
  }
  getRooms() {
    this.currentUser.getJoinableRooms()
    .then(joinableRooms => {
        this.setState({
            joinableRooms,
            joinedRooms: this.currentUser.rooms
        })
    })
    .catch(err => console.log('error on joinableRooms: ', err))
}

subscribeToRoom(roomId) {
    this.setState({ messages: [] });
    this.currentUser.subscribeToRoom({
      roomId: roomId,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          });
        }
      },
      messageLimit: 20
    })
    .then(room => {
        this.setState({
            roomId: room.id
        })
        this.getRooms()
    })
    .catch(err => console.log('error on subscribing to room: ', err))
}
  _sendMessage(text) {
    this.currentUser.sendMessage({
      text,
      roomId: this.state.roomId
    });
  }

  createRoom(name) {
    this.currentUser.createRoom({
        name
    })
    .then(room => {
        this.subscribeToRoom(room.id)
    })
    .catch(err => console.log('error with createRoom: ', err))
}


  render() {
    return (
      <div className="app">
        <RoomList
          subscribeToRoom={this.subscribeToRoom}
          rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]}
          roomId={this.state.roomId} />
        <MessageList 
          roomId={this.state.roomId}
          messages={this.state.messages} />
        <SendMessageForm
          disabled={!this.state.roomId}
          _sendMessage={this._sendMessage} />
        <NewRoomForm createRoom={this.createRoom} />
      </div>
    );
  }
}

export default App;
