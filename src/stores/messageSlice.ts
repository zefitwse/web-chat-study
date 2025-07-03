import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: { messageArr: [] as any, theme: "light" },
  reducers: {
    insertQAMessageToStore: (state, action) => {
      state.messageArr.push(action.payload);
    },
    initMessageArr: (state, action) => {
      state.messageArr = action.payload;
    },
    appendAnswerToStore: (state, action) => {
      const index = state.messageArr.findIndex((item: any) => {
        return item.id === action.payload.id;
      });

      if (index === -1) return;

      const message = state.messageArr[index];

      if (!action.payload.end) {
        state.messageArr[index] = {
          ...message,
          partialText: action.payload.chunk,
        };
      } else {
        state.messageArr[index] = {
          ...message,
          result: action.payload.tempText,
          partialText: action.payload.chunk,
          streaming: false,
        };
      }
    },
  },
});

export const { insertQAMessageToStore, appendAnswerToStore, initMessageArr } =
  messageSlice.actions;

export default messageSlice.reducer;
