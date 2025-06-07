import { createSlice } from "@reduxjs/toolkit";

interface LoadingState {
  userState: boolean;
}

const initialState: LoadingState = {
  userState: false
};

const getterSlice = createSlice({
  name: "getter",
  initialState,
  reducers: {
    setUserStateGetter: (state, action) => {
      state.userState = !state.userState;
    }
  },
});

export const { setUserStateGetter } = getterSlice.actions;
export default getterSlice.reducer;
