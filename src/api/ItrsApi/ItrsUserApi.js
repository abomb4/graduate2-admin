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
      url: API_BASE_URL + '/myProfile/user/modifyPassword',
      method: 'post',
      data: objectToFormData(data),
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      withCredentials: true
    });
    handlePromise(promise, success, fail);
  }

  /**
   * 根据条件查询用户,不进行分页
   *
   * @param {*} data UserQuery,不带分页参数
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static listUser(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/userlist/list',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 根据条件分页查询用户，并进行分页
   *
   * @param {*} data UserQuery,带分页参数pageNo,pageSize
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static listUserPage(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/user/listPage',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 创建新用户
   *
   * @param {Object} user 用户信息，需要包含userName, email, password, salt, sex, departmentId, realName
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static createUser(user, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/user/new',
      method: 'put',
      data: objectToFormData(user),
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 修改用户信息
   *
   * @param {Object} user 必须包含id
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static modifyUser(user, success, fail) {
    if (!user.id) {
      fail({error: 'No id specified.'});
      return;
    }
    const promise = axios({
      url: API_BASE_URL + '/myProfile/user/modify',
      method: 'post',
      data: objectToFormData(user),
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  static resetPassword(id, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/user/resetPassword/' + id,
      method: 'get',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}

export default ItrsUserApi;
