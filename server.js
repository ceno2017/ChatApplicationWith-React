// const Chatkit = require("@pusher/chatkit-server");
//import {ChatManager, TokenProvider} from '@pusher/chatkit-client';
const ChatManager = require("@pusher/chatkit-client");
let TokenProvider = require("@pusher/chatkit-client");
const instanceLocator = "v1:us1:d40f8f1e-5a02-46b1-a8d6-05c78761c5ba";

const key =
  "1269214a-6ca0-4c7e-9fa0-5e6de2a9a563:ilPV9BRj0PUdRTxO185Mals5aCIaDJDiGGOVZqlPiXg=";
const tokenUrl = "https://us1.pusherplatform.io/services/chatkit_token_provider/v1/d40f8f1e-5a02-46b1-a8d6-05c78761c5ba/token";

// const chatkit = new Chatkit.default({
//   instanceLocator: instanceLocator,
//   key: key
// });

// chatkit
//   .createRoom({
//     creatorId: "charlosky",
//     name: "Room 2",
//     customData: { foo: 43 }
//   })
//   .then(response => {
//     console.log(response);
//   })
//   .catch(err => {
//     console.log(err);
//   });

const chatManager = new ChatManager({
  instanceLocator,
  userId: "charlosky",
  tokenProvider: new TokenProvider({ url: tokenUrl })
});
chatManager
  .connect()
  .then(currentUser => {
    currentUser.subscribeToRoom({
      roomId: 25159478,
      messageLimit: 20,
      hooks: {
        onMessage: message => {
          this.setState({
            messages: [...this.state.messages, message]
          });
        }
      }
    });
    currentUser
      .sendMessage({
        text: "Hello there!",
        roomId: 25159478
      })
      .then(messageId => {
        console.log(`Added message succesfully`);
      })
      .catch(err => {
        console.log(`Error adding message: ${err}`);
      });
  })
  .catch(err => {
    console.log("Error on connection", err);
  });
