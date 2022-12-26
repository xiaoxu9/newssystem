import './App.css';
import MRouter from './router/IndexRouter'
import {Provider} from 'react-redux'
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MRouter></MRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
