import express from 'express'; 
const app = express();
const port = 9000;
const WebSocket = require("ws");
const appRootSaga = require("./sagas");
const drizzleOptions = require("../src/drizzleOptions");
const Storage = require("../src/contracts/Storage.json");
const { takeEvery, takeLatest } = require("redux-saga/effects");
const { generateStore, EventActions, Drizzle } = require("@drizzle/store");
const Web3 = require("web3");

const options = {
  contracts: [Storage],
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:9545"),
  },
};



const contractEventNotifier = store => next => action => {
  if (action.type === EventActions.EVENT_FIRED) {
    const contract = action.name;
    const contractEvent = action.event.event;
    const contractMessage = action.event.returnValues._message;
    const display = `${contract}(${contractEvent}): ${contractMessage}`;

    // interact with your service
    console.log("Contract event fired", display);
  }
  return next(action);
};


// reducers
const todosReducer = (state = [], action) => {
  if (action.type === "TODOS_RECEIVED") {
    // update your state
    return action.todos;
  }

  return state;
};

// app Reducers and Sagas
const appReducers = { todos: todosReducer };
const appSagas = [appRootSaga];

const store = generateStore({
  options,
  appReducers,
  appSagas
});

const drizzle = new Drizzle(options, store);

// const wss = new WebSocket.Server({ port: 8080 });

// wss.on("connection", function connection(ws) {
//   ws.on("message", function incoming(message) {
//     console.log("received: %s", message);
//   });

//   ws.send("something");
// });

drizzle.store.subscribe(() => {
  console.log(drizzle.store.getState());
});

app.get("/", (req, res) => {
  res.send("Go to /fetch");
});



app.get("/fetch", (req, res) => {
  // store.dispatch({ type: TODOS_FETCH });
  store.dispatch({ type: "TEST" });

  res.sendStatus(200);
});

app.get("/getData", (req, res) => {
  // Assuming we're observing the store for changes.
  const state = drizzle.store.getState();

  // If Drizzle is initialized (and therefore web3, accounts and contracts), continue.
  if (!state.drizzleStatus.initialized) {
    // Declare this call to be cached and synchronized. We'll receive the store key for recall.
    // If Drizzle isn't initialized, display some loading indication.
    res.send("Loading...");
    return;
  }

  const dataKey = drizzle.contracts.Storage.methods.getData.cacheCall();

  // Use the dataKey to display data from the store.
  res.send(state.contracts.Storage.getData[dataKey].value);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
