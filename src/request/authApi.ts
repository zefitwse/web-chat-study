import request from "./request";

type getRefreshTokenProps = {};

export const getRefreshToken = (data?: getRefreshTokenProps) => {
  return request({
    url: "",
    method: "",
    data,
  });
};
