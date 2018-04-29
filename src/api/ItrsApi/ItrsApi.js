// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';

/**
 * 通用处理axios promise，方便回调
 * 
 * @param {Promise} promise axios promise
 * @param {Function} success 成功回调，会塞入服务端返回的信息
 * @param {Function} fail 失败回调，会塞入axios原始错误对象
 */
function handlePromise(promise, success, fail) {
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

const API_BASE_URL = 'http://localhost:8080';

/**
 * Itrs系统Api封装
 */
class ItrsDataApi {

  /**
   * 获取用户接口。
   * 成功返回格式：
   * {
   *   success: true,
   *   message: "Get success.",
   *   data: {
   *     id: 1,
   *     username: "wlyyy",
   *     email: "wlyyy@163.com",
   *     gmtCreate: "2020-02-02",
   *     gmtModify: "2020-03-03",
   *     realName: "大宝宝",
   *     departmentId: 1,
   *     sex: 2
   *   }
   * }
   * 
   * @param {Number} id id
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static getUser(id, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/user/' + id,
      method: 'get'
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 获取用户接口。
   * 成功返回格式：
   * {
   *   success: true,
   *   message: "Get success.",
   *   "data": [
   *       {
   *           "id": 1,
   *           "englishName": "Product",
   *           "chineseName": "产品",
   *           "subTypes": [
   *           {
   *               "id": 13,
   *               "englishName": "Analyser",
   *               "chineseName": "需求分析",
   *               "subTypes": []
   *           },
   *           {
   *               "id": 14,
   *               "englishName": "PM",
   *               "chineseName": "产品经理",
   *               "subTypes": []
   *           }
   *       ]
   *    },
   * }

   * 
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static getPositions(success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/positions',
      method: 'get'
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}

export default ItrsDataApi;
