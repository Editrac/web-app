import { combineReducers, createStore, compose, applyMiddleware, Store } from 'redux';
import thunk from 'redux-thunk';
import { persistStore, persistReducer, Persistor } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import authReducer from './auth/reducer';
import { IAuthState } from './auth/type';
import playerReducer from './player/reducer';
import { IPlayerState } from './player/type';
import organisationReducer from './organisation/reducer';
import { IOrganisationState } from './organisation/type'

/*
 * combines all the existing reducers
 */
export interface IState {
  authReducer: IAuthState;
  playerReducer: IPlayerState;
  organisationReducer: IOrganisationState
}

const persistConfig = {
  key: 'ediflo',
  storage,
  blacklist: ['organisationReducer', 'authReducer']
}

const authPersistConfig = {
  key: 'auth',
  storage
}

const organisationPersistConfig = {
  key: 'organisation',
  storage,
  whitelist: ['selectedOrganisation']
}

const rootReducers = combineReducers<IState>({
  authReducer: persistReducer<any, any>(authPersistConfig, authReducer),
  playerReducer,
  organisationReducer: persistReducer<any, any>(organisationPersistConfig, organisationReducer)
});

const persistedReducer = persistReducer(persistConfig, rootReducers)

const middleware = [thunk];

const enhancers = [applyMiddleware(...middleware)];

const configureStore = (): { store: Store<IState>, persistor: Persistor } => {
  const store = createStore(persistedReducer, compose(...enhancers))
  const persistor = persistStore(store)
  return { store, persistor }
};

export default configureStore();
