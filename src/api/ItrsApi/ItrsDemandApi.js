// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs候选人Api封装
 */
export default class ItrsDemandApi {

  /**
   * 分页查询。
   * 成功返回格式：
   * {
   *     "success": true,
   *     "message": "Query success",
   *     "pageNo": 1,
   *     "pageSize": 10,
   *     "total": 20,
   *     "datas": [
   *         {
   *             "id": 123,
   *             "demandNo": "sdafhrgfgf433",
   *             "publisherId": 123,
   *             "publisherName": "publisherName001",
   *             "positionType": 211,
   *             "jobName": "position001",
   *             "departmentId": 121,
   *             "departmentName": "departmentName001",
   *             "hrName": "hrName001",
   *             "total": 3,
   *             "workingPlace": "workingPlace001",
   *             "degreeRequest": "degreeRequest001",
   *             "status": 1,
   *             "memo": "memo001",
   *             "gmtCreate": "gmtCreate001",
   *             "gmtModify": "gmtModify001"
   *         }
   *     ]
   * }
   *
   * 请求参数：
   * | pageNo | 页码 | Number | - | Y
   * | pageSize | 分页大小 | Number | - | Y
   * | publisherId | 发布者id | String | - | N
   * | positionType | 职位类别 | Number | 职位类别代码 | N
   * | subPositionType | 职位子类 | Number | 职位子类代码 | N
   * | jobName | 岗位名 | String | 具体的岗位完整名称 | N
   * | departmentId | 所属部门id | Number | - | N
   * | hrName | HR姓名 | String | 姓名匹配查询 | N
   * | totalStart | 招聘总人数最小值 | Number | - | N
   * | totalEnd | 招聘总人数最大值 | Number | - | N
   * | workingPlace | 工作地点 | String | 工作地点匹配 | N
   * | degreeRequest | 学位要求 | String | 匹配 | N
   * | gmtModifyStart | 需改时间起始 | String | yyyy-MM-dd HH:mm:ss | N
   * | gmtModifyEnd | 需改时间结束 | String | yyyy-MM-dd HH:mm:ss | N
   *
   * @param {Object} data 见上面请求参数
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static list(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/demand/list',
      method: 'get',
      params: data
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 根据id查询招聘需求详细信息
   *
   * @param {Number} id 需求 id
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static getById(id, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/demand/get/' + id,
      method: 'get'
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
  * 查询最新职位需求。
  * 成功返回格式：
  * {
  *     "success": true,
  *     "message": "根据招聘需求id查找招聘需求成功",
  *     "data": {
  *         "id": 123,
  *         "demandNo": "sdafhrgfgf433",
  *         "publisherId": 123,
  *         "publisherName": "publisherName001",
  *         "positionType": 211,
  *         "jobName": "position001",
  *         "departmentId": 121,
  *         "departmentName": "departmentName001",
  *         "hrName": "hrName001",
  *         "total": 3,
  *         "workingPlace": "workingPlace001",
  *         "degreeRequest": "degreeRequest001",
  *         "status": 1,
  *         "memo": "memo001",
  *         "gmtCreate": "gmtCreate001",
  *         "gmtModify": "gmtModify001"
  *     }
  * }
  *
  * @param {Function} success 成功回调，会塞入服务端返回的信息
  * @param {Function} fail 失败回调，会塞入axios原始错误对象
  */
  static getNew(success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/demand/new',
      method: 'get'
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 分页查找当前用户发布的所有招聘需求
   *
   * 请求参数：
   * | pageNo | 页码 | Number | - | Y
   * | pageSize | 分页大小 | Number | - | Y
   *
   * @param {*} data 见上面请求参数
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static getMyDemand(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/mydemand/list',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 分页查找当前用户同部门的所有招聘需求（给部门领导用）
   * 
   * 请求参数：
   * | pageNo | 页码 | Number | - | Y
   * | pageSize | 分页大小 | Number | - | Y
   * 
   * @param {*} data 见上面请求参数
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static getFollowingDemand(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/mydemandFollowing/list',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * HR发布需求
   *
   * @param {Object} data 需求数据
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static publishDemand(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/demand',
      method: 'post',
      data: objectToFormData(data),
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * HR修改需求
   *
   * @param {Object} data 需求数据
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static updateDemand(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/demand',
      method: 'put',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 逻辑删除招聘需求
   *
   * @param {*} id 招聘需求id
   * @param {*} success 成功回调，会塞入服务端返回的信息
   * @param {*} fail 失败回调，会塞入axios原始错误对象
   */
  static deleteDemand(id, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/demand/delete/' + id,
      method: 'get',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}
