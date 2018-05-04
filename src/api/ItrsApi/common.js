
export const API_BASE_URL = 'http://localhost:8080';

/**
 * 通用处理axios promise，方便回调
 * 
 * @param {Promise} promise axios promise
 * @param {Function} success 成功回调，会塞入服务端返回的信息
 * @param {Function} fail 失败回调，会塞入axios原始错误对象
 */
export function handlePromise(promise, success, fail) {
  promise
    .then((result) => {
      if (success) {
        success(result.data);
      }
    })
    .catch((result) => {
      if (fail) {
        fail(result);
      }
    });
}
