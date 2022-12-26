import {legacy_createStore, combineReducers} from 'redux'
import {CollapsedReducer} from './reducers/CollapsedReducer'
import { LoadingReducer } from './reducers/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['CollapsedReducer'],  //由于默认持久化全部 得加上 whitelist 设置哪些reducer持久化 设置只持久化CityReducer
    // blacklist: ['navigation']  // blacklist设置哪些reducer不持久化

}


const reducer = combineReducers({
    CollapsedReducer,  // 管理侧边栏
    LoadingReducer,  // 管理展示加载中
})

// 持久化reducer
const persistedReducer = persistReducer(persistConfig, reducer)


const store = legacy_createStore(persistedReducer)

let persistor = persistStore(store)

export {store, persistor};