// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs角色相关Api封装
 */
export default class ItrsRoleApi {

  /**
   * 查询所有角色信息列表
   * 
   * @param {*} success 成功回调处理函数
   * @param {*} fail 失败回调处理函数
   */
  static listRole(success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/user/roleList',
      method: 'get',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 查询该用户id下的已有角色列表
   * 
   * @param {*} id 用户id
   * @param {*} success 成功回调处理函数
   * @param {*} fail 失败回调处理函数
   */
  static listExisRole(id, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/user/exisRoleList/' + id,
      method: 'get',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}