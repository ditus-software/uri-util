//
// Copyright (c) DITUS INC. All rights reserved. See LICENSE file in the project
// root for details.
//
// import queryString from 'query-string';

/**
 * Provides methods for working with a uniform resource identifier (URI).
 */
export default class UriUpc {
  /**
   * Adds the specified parameter to the URL, replacing any existing parameter of the same name.
   *
   * @param {string} url The URL.
   * @param {string} parameterName The name of the parameter to add/replace.
   * @param {string} value The value of the parameter. The value will be encoded by this method.
   * @returns {string} The URL with the parameter/value added.
   */
  static addParameter(url, parameterName, value) {
    let newUrl = url;

    // If the URL is not specified, then we can simply append the parameter onto
    // an empty string. There may be some use for such a use case.
    if (!newUrl || newUrl.trim() === '') {
      newUrl = '';
    }

    // If the parameter name is not specified, then there is nothing to do.
    if (!parameterName || parameterName.trim() === '') {
      return newUrl;
    }

    // If the value is not specified, then simply remove the parameter and
    // return the URL.
    newUrl = this.removeParameter(newUrl, parameterName);
    if (!value || value.trim() === '') {
      return newUrl;
    }

    // The parameter will either need to be prefixed with a question
    // mark or ampersand depending on whether there are other parameters on the
    // URL.
    if (newUrl.indexOf('?') < 0) {
      // There are no other parameters, meaning that the parameter is the first
      // parameter.
      newUrl += '?';
    } else {
      // There are other parameters, meaning that the parameter is the last
      // parameter.
      newUrl += '&';
    }

    return newUrl.concat(parameterName, '=', encodeURIComponent(value));
  }

  /**
   * Appends a forward-slash to the specified value  if no forward-slash
   * already exists.
   *
   * @param {string} value The value.
   * @returns {string} The value with a forward-slash appended to it.
   */
  static appendForwardSlash(value) {
    if (!value || value.trim() === '') {
      return '/';
    }

    if (!value.endsWith('/')) {
      return `${value}/`;
    }

    return value;
  }

  /**
   * Combines two parts of a URL and separates them with a backslash if there
   * already isn't one.
   *
   * @param {string} value1 The first value.
   * @param {string} value2 The second value.
   * @returns {string} The two parts combined with a single backslash separating
   * them.
   */
  static combine(value1, value2) {
    if ((!value1 || value1.trim() === '') && (!value2 || value2.trim() === '')) {
      return null;
    }

    let newValue1 = value1;
    if (newValue1 && newValue1.endsWith('/')) {
      newValue1 = newValue1.substring(0, newValue1.length - 1);
    }

    let newValue2 = value2;
    if (newValue2?.startsWith('/')) {
      newValue2 = newValue2.substring(1);
    }

    let result = '';
    if (newValue1 && newValue1.trim() !== '') {
      result = newValue1;
    }

    if (newValue2 && newValue2.trim() !== '') {
      if (result && result.trim() !== '') {
        result = result.concat('/');
      }

      result = result.concat(newValue2);
    }

    return result;
  }

  /**
   * Returns the domain name from the URL.
   *
   * @param {string} url The URL.
   * @returns {string} The domain name without the www. For example:
   * anything.com OR test.anything.com.
   */
  static getDomainName(url) {
    if (!url || url.trim() === '') {
      return null;
    }

    let newUrl = url;

    const i = newUrl.indexOf('?');
    if (i !== -1) {
      newUrl = newUrl.substring(0, i);
    }

    let result = newUrl.replace('http://', '').replace('https://', '').replace('www.', '').split('/')[0];

    // Removes port (if any).
    const colon = result.indexOf(':');
    if (colon !== -1) {
      result = result.substring(0, colon);
    }

    const parts = result.split('.');
    if (parts.length === 1) {
      return parts[0];
    }

    if (parts.length > 2) {
      return parts[parts.length - 2].concat('.', parts[parts.length - 1]);
    }

    return parts[0].concat('.', parts[1]);
  }

  /**
   * Parses the specified value as an integer, ensures that it is within a range
   * and returns a default value when outside the range or not a valid integer.
   *
   * @param {string} value The value.
   * @param {number} min The minimum value.
   * @param {number} max The maximum value.
   * @param {number} defaultValue The default value.
   * @returns {number} Either the value converted to an integer or the
   * defaultValue if it is not a number or outside the specified range.
   */
  static parseIntParameter(value, min, max, defaultValue) {
    if ((!value || value.trim() === '') || !Number.isInteger(+value)) {
      return defaultValue;
    }

    const result = Number.parseInt(value, 10);
    if (result < min || result > max) {
      return defaultValue;
    }

    return result;
  }

  /**
   * Parses the specified value as a string and returns a default value if null,
   * undefined, an empty string, or white space.
   *
   * @param {*} value The value.
   * @param {*} defaultValue The value that should be returned if the value is
   * null, undefined, an empty string, or white space.
   * @returns {string} The value as a string.
   */
  static parseStringParameter(value, defaultValue) {
    if ((!value || value.trim() === '')) {
      return defaultValue;
    }

    return value;
  }

  /**
   * Removes the specified parameter from the URL.
   *
   * @param {string} url The URL that may or may not contain the parameter.
   * @param {string} parameterName The name of the parameter to remove.
   * @returns {string} The URL without the parameter.
   */
  static removeParameter(url, parameterName) {
    if ((!url || url.trim() === '') || (!parameterName || parameterName.trim() === '')) {
      return url;
    }

    const splitUrl = url.split('?');
    if (splitUrl.length === 1) {
      return url;
    }

    let newUrl = splitUrl[0];
    const qs = splitUrl[1];
    const parameters = qs.split('&');
    for (let i = parameters.length - 1; i >= 0; i -= 1) {
      const parameter = parameters[i].split('=')[0];
      if (parameter.toLowerCase() === parameterName.toLowerCase()) {
        parameters.splice(i, 1);
      }
    }

    newUrl = `${newUrl}?${parameters.join('&')}`;

    if (newUrl.endsWith('?')) {
      newUrl = newUrl.substring(0, newUrl.length - 1);
    }

    return newUrl;
  }
}
