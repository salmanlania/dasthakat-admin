import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCollapsed: window.innerWidth <= 1000 ? true : false,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state, action) => {
      state.isCollapsed = action.payload || !state.isCollapsed;
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
