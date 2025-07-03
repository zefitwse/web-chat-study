import { openDB } from "idb";

const db = await openDB("chat-rag", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("messages")) {
      db.createObjectStore("messages", {
        keyPath: "id",
        autoIncrement: true,
      });
    }
  },
});

// 用户消息入库
export const QAInsertDB = async (
  userQusetion: any,
  rolo: any,
  detailMessage?: any
) => {
  try {
    if (rolo === "user") {
      await db.add("messages", userQusetion);
    } else {
      await db.add("messages", detailMessage);
    }
  } catch (error) {
    console.log(error, "入库错误");
  }
};

// 追加回复
export const AnswerContinueInsertDB = async (
  answerMessageObj: any,
  prevText: any,
  chunkText?: any
) => {
  try {
    await db.put("messages", {
      ...answerMessageObj,
      partialText: prevText + chunkText,
    });
  } catch (error) {
    console.log(error, "答案追加时候，入库错误");
  }
};

// 回复结束
export const AnswerInsertFinish = async (pre: any, tempText: any) => {
  try {
    await db.put("messages", {
      ...pre,
      result: tempText,
      streaming: false, // 结束流式标记
      partialText: undefined,
    });
  } catch (error) {
    console.log(error, "结束追加时候，入库错误");
  }
};

// 获取table的所有信息
export const getAllMessages = async (tableName: any) => {
  try {
    let res = await db.getAll("messages");
    return res;
  } catch (error) {
    console.log(error, "出库错误");
    return [];
  }
};
