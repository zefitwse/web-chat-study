import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const themeSlice = createSlice({
  name: "theme",
  initialState: { isDark: false },
  reducers: {
    changeTheme: (state, action: PayloadAction<boolean>): void => {
      state.isDark = action.payload;
      if (state.isDark) {
        document.documentElement.classList.add("theme-dark");
        document.documentElement.classList.remove("theme-light");
      } else {
        document.documentElement.classList.add("theme-light");
        document.documentElement.classList.remove("theme-dark");
      }
    },
  },
});

export const { changeTheme } = themeSlice.actions;
export default themeSlice.reducer;
