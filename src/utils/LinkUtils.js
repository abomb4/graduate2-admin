import queryString from 'qs';

/**
 * 处理链接相关操作，如链接跳转、重定向等？
 *
 */
class LinkUtils {

  /**
   * 解析Get参数为对象
   *
   * @param {String} url
   */
  static parseGetParameter(url) {
    var param;
    if (url.startsWith('?')) {
      param = url.substring(1, url.length);
    } else {
      param = url;
    }
    return queryString.parse(param);
  }
}

export default LinkUtils;
