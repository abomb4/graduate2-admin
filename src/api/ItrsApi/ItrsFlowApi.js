// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs流程相关Api封装
 */
export default class ItrsFlowApi {

  static UPLOAD_PATH = API_BASE_URL + '/upload';

  /**
   * 员工推荐。
   *
   * | 字段 | 说明 | 类型 | 备注 | 是否必填
   * | demandId | 需求id | Number | - | Y
   * | name | 推荐人姓名 | String | - | Y
   * | sex | 性别 | Number | 0未知1男2女 | Y
   * | phoneNo | 手机号 | String | 中国手机号 | Y
   * | email | 电子邮箱 | String | - | Y
   * | graduateTime | 毕业时间 | String | yyyy-MM-dd | Y
   * | degree | 最高学位 | String | - | N
   * | workingPlace | 期望工作地点 | String | - | N
   * | memo | 备注 | String | - | N
   * | attachment | 附件标记 | String | - | N
   *
   * @param {Object} data  见上面请求参数
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static recommend(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/flow/recommendTalent',
      method: 'POST',
      data: objectToFormData(data),
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 根据招聘需求编号展示其下的展示层招聘流程信息表（给hr用）。
   *
   * @param {Object} demandId 招聘需求id
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static getByDemandId(demandId, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/flow/listApplyFlowHr/' + demandId,
      method: 'get',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 根据招聘需求编号展示其下的展示层招聘流程信息表（给部门经理用）。
   * 
   * @param {*} demandId 招聘需求id
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static getByDemandIdForManager(demandId, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/flow/listApplyFlowManager/' + demandId,
      method: 'get',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 查询需要面试的流程，提供给普通员工使用
   *
   * @param {Object} data 可选pageNo, pageSize
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static needInterview(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/flow/listApplyFlowInterviewee',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 查询该用户下的所有流程信息
   *
   * @param {Object} data 可选pageNo, pageSize
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static listRecommenders(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/flow/listApplyFlowRecommender',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 查询c
   *
   * @param {Object} data 可选pageNo, pageSize
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static listHistoricFlow(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/flow/listHistoricFlow',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 处理流程任务
   *
   * ==== 请求参数
   * [options="header"]
   * |======
   * | 字段 | 说明 | 类型 | 备注 | 是否必填
   * | outcome | 连线名称（通过or不通过等） | String | 连线名称（通过or不通过等） | N 给出通过or不通过结果时需要
   * | nextUserId | 下一任务的完成人 | String | 除最后一个节点外，必须，且只能有一个 | N
   * | result | 当前流程结果 | String | 流程名 + 操作名 | N 给出通过or不通过结果时需要
   * | taskId | 任务id | String | 必须 | Y
   * | id | 招聘流程id | Number | 对应applyFlowId | Y
   * |======
   *
   * @param {Object} data 请求参数
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static deal(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/flow/deal',
      method: 'post',
      data: objectToFormData(data),
      config: { headers: {'Content-Type': 'multipart/form-data' }},
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}
