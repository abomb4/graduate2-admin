// eslint-disable-next-line
import objectToFormData from 'object-to-formdata';
import axios from 'axios';
import { API_BASE_URL, handlePromise } from './common.js';

/**
 * Itrs候选人Api封装
 */
export default class ItrsCandidateApi {

  /**
   * 分页复杂条件查询人才库。
   * 成功返回格式：
   * {
   *   "success": true,
   *   "message": "查询人才库列表成功!",
   *   "datas": [
   *     {
   *       "id": 1,
   *       "name": "翁羚晏",
   *       "sex": 1,
   *       "phoneNo": "15279109892",
   *       "email": "397055871@qq.com",
   *       "graduateTime": "2014-04-29",
   *       "degree": "",
   *       "workingPlace": "",
   *       "memo": "",
   *       "attachment": "",
   *       "gmtCreate": "2018-04-29",
   *       "gmtModify": "2018-04-29"
   *     },
   *     {
   *       "id": 2,
   *       "name": "翁大宝",
   *       "sex": 1,
   *       "phoneNo": "15279109893",
   *       "email": "397055871@qq.com",
   *       "graduateTime": "",
   *       "degree": "本科",
   *       "workingPlace": "",
   *       "memo": "",
   *       "attachment": "",
   *       "gmtCreate": "2018-04-29",
   *       "gmtModify": "2018-04-29"
   *     }
   *   ],
   *   "pageNo": 1,
   *   "pageSize": 10,
   *   "total": 2
   * }
   *
   * @param {Object} id id 要包含pageNo，pageSize
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static list(data, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/candidate/list',
      method: 'get',
      params: data,
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }

  /**
   * 获取用户接口。
   * 成功返回格式：
   * {
   *     "success": true,
   *     "message": "根据候选人id查找招聘需求成功!",
   *     "data": {
   *         "id": 1,
   *         "name": "翁羚晏",
   *         "sex": 1,
   *         "phoneNo": "15279109892",
   *         "email": "397055871@qq.com",
   *         "graduateTime": "2014-04-29",
   *         "degree": "",
   *         "workingPlace": "",
   *         "memo": "",
   *         "attachment": "",
   *         "gmtCreate": "2018-04-29",
   *         "gmtModify": "2018-04-29"
   *     }
   * }
   *
   * @param {Number} id 候选人id
   * @param {Function} success 成功回调，会塞入服务端返回的信息
   * @param {Function} fail 失败回调，会塞入axios原始错误对象
   */
  static getById(id, success, fail) {
    const promise = axios({
      url: API_BASE_URL + '/myProfile/candidate/get/' + id,
      method: 'get',
      withCredentials: true
    });
    handlePromise(promise, success, fail);
    return promise;
  }
}
