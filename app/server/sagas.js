const { takeEvery, call, put, takeLatest } = require("redux-saga/effects");
// fetch data from service using sagas
function* fetchTodos() {
  yield call(() => console.log("FETCH"));
  // const todos = yield fetch(
  //   "https://jsonplaceholder.typicode.com/todos"
  // ).then(resp => response.json());
  yield put({ type: "TODOS_RECEIVED", todos: ["aaa"] });
}

function* test() {
  console.log("test balances 2");
}
function* accountBalancesSaga2() {
  yield takeEvery("TEST", test);
}

module.exports = accountBalancesSaga2;
