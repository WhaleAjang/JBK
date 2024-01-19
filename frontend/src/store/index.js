import { combineReducers, configureStore} from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import storage from 'redux-persist/lib/storage';
import {FLUSH, PAUSE, PERSIST, REGISTER, REHYDRATE, persistReducer, persistStore} from 'redux-persist';

const rootReducer = combineReducers({
    user: userReducer,
    //다른 reducer들
})

const persistConfig = {
    key: 'root',  //key이름 : 저장할 때 사용된다
    storage,  //local storage에 저장된다.
}
//인자로 (config, 원래 reducer) -> persistedReducer가 반환된다
const persistedReducer = persistReducer(persistConfig,rootReducer);

//반환된 persisted를 기존의 reducer가 있었던 곳에 넣어준다
export const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware(
        {
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE,PAUSE,PERSIST,REGISTER]
            }
    })
})

export const persistor = persistStore(store);