// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs积分相关Api封装
 */
export default class ItrsScoreApi {
  
  /**
   * 分页查询用户积分变动
   * 
   * | 字段 | 说明 | 类型 | 备注 | 是否必填
   * | pageNo | 页码 | Number | - | Y
   * | pageSize | 分页大小 | Number | - | Y
   * 
   * @param {*} data 见上面请求参数
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static getScoreList(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/score/list',
      method: 'GET',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 查询用户当前积分
   * 
   * @param {*} success 成功回调，会塞入服务端返回的信息 
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static getCurrentScore(success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/score/current',
      method: 'GET',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 分页查询积分规则
   * 
   * | 字段 | 说明 | 类型 | 备注 | 是否必填
   * | pageNo | 页码 | Number | - | Y
   * | pageSize | 分页大小 | Number | - | Y
   * 
   * @param {*} data 见上面请求参数
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static getScoreRule(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/score/rule',
      method: 'GET',
      params: data,
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}