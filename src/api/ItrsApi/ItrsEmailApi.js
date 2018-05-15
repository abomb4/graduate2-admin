// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs邮件相关Api封装
 */
export default class ItrsEmailApi {

  /**
   * 分页查询邮件日志列表
   * 
   * @param {*} data pageNo + pageSize
   * @param {*} success 成功回调处理函数
   * @param {*} fail 失败回调处理函数
   */
  static listEmailLog(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/user/emailLog/list',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}