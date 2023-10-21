import { configureStore } from '@reduxjs/toolkit'
import windowWidth from "../slicers/windowWidth";

const store = configureStore({
  reducer: {
    windowWidthReducer: windowWidth
  }
});

export default store;