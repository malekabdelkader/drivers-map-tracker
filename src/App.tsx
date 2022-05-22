import React from "react";
import { Provider } from 'react-redux';
import store from './store/index'
import Tracker from './Tracker';
function App() {
  return (
    <Provider store={store}>
    <Tracker/>
    </Provider>
  );
}

export default App;
