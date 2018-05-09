// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs用户功能Api封装
 */
class ItrsUserApi {

  /**
   * 修改密码
   *
   * @param {Object} data 参数
   * @param {Function} success 成功回调
   * @param {Function} fail 失败回调
   */
  static modifyPassword(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/user/modifyPassword',
      method: 'post',
      data: objectToFormData(data),
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      withCredentials: true
    });
    handlePromise(promise, success, fail);
  }
}

export default ItrsUserApi;
