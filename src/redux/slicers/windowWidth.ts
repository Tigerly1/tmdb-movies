// windowWidthSlice.ts
import { createSlice } from "@reduxjs/toolkit";

const isBrowser = typeof window !== "undefined"; 
const initialWidth = isBrowser ? window.innerWidth : 0; // Use 0 as a default value if not in browser

const windowWidthSlice = createSlice({
  name: "windowWidth",
  initialState: initialWidth,
  reducers: {
    setWindowWidth: (state, action) => action.payload
  }
});

export const { setWindowWidth } = windowWidthSlice.actions;
export default windowWidthSlice.reducer;
