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
  userQusetion: object,
  rolo: string,
  detailMessage?: object
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
  answerMessageObj: object,
  prevText: string,
  chunkText?: string
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
export const AnswerInsertFinish = async (pre: object, tempText: string) => {
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
export const getAllMessages = async (tableName: string) => {
  try {
    let res = await db.getAll("messages");
    return res;
  } catch (error) {
    console.log(error, "出库错误");
    return [];
  }
};


// 生成 randomCode
export const makeRandomCode = () => {
  const ranCode = Math.random().toString(36).substring(2, 8);
  return ranCode;
};

// 生成 timeStamp
export const makeTimestamp = () => {
  const timestamp = Date.now().toString();
  return timestamp;
};
