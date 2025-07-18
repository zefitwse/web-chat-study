export function postChat(userInfo:any,data:any) {

  return fetch(`/api/maas/agent/${userInfo.agentId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream', // 或 application/json
      'Authorization': `Bearer ${userInfo.userApiKey}`
    },
    body: JSON.stringify( data ),
    // signal,
  });
}
// 他这个傻逼接口为什么每次都要吧之前的数据也带上？我在前端做的是增量的设计，明显好于次次都是全量的情况。
// 每一次都是全量返回真的很傻逼