// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs字典数据Api封装
 */
class ItrsDictionaryApi {

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
      url: API_BASE_URL + '/dict/positionTypeTree',
      method: 'get'
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  static getDepartmentLIst(success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/dict/departmentList',
      method: 'get'
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}

export default ItrsDictionaryApi;
