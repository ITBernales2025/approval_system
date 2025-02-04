import {createSlice} from "@reduxjs/toolkit"

const initialState = {
  userInfo: null,
  allUsers: [],

};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
    },
    setAllUsers: (state, action) => {
      state.allUsers = action.payload
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, logout, setAllUsers } = authSlice.actions;
export default authSlice.reducer;
