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

// 模型回答入库
export const AnswerContinueInsertDB = async (
  answerMessageObj: object,
  prevText: string,
  newText?: string
) => {
  try {
    await db.put("messages", {
      ...answerMessageObj,
      partialText: prevText + newText,
    });
  } catch (error) {
    console.log(error, "答案追加时候，入库错误");
  }
};

// 模型回复结束
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
    let res = await db.getAll(tableName);
    return res;
  } catch (error) {
    console.log(error, "出库错误");
    return [];
  }
};

// 更新某个table的数据
export const updateDB = async (tableName: string, dataObj: any) => {
  try {
    await db.put(tableName, dataObj);
  } catch (error) {
    console.log(error, "更新错误");
  }
};

// 查找最后一条消息的id

export const getLastMessage = async (messages:any) => {
  const tx = db.transaction(messages, "readonly");
  const store = tx.objectStore(messages);

  // 从主键倒序打开 cursor，第一条就是最后一条记录
  const cursor = await store.openCursor(null, "prev");

  await tx.done;

  if (cursor) {
    return cursor;
  } else {
    return undefined; // 没有任何记录
  }
};

// 清楚当前聊天记录？
export const clearMessagesTable = async () => {
  try {
    await db.clear("messages");
    console.log("messages 表已清空");
  } catch (error) {
    console.error("清空 messages 表失败", error);
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
