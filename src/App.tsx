import './App.css';
import './theme/common.css';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import config from './store/config';
import AppWithTheme from './theme/app-theme';
import { PersistGate } from 'redux-persist/integration/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'

const { store, persistor } = config;

const App: React.FC = () => {
  document.documentElement.className = 'dark-theme';
  return (
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <DndProvider backend={HTML5Backend}>
            <AppWithTheme />
          </DndProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
