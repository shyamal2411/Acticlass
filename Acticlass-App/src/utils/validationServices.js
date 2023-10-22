import validator from 'validator';
import {ROLES} from '../common/constants';
import {isEmpty, isString, isUndefined} from 'lodash';

class validationServices {
  /**
   *
   * @param {String} email
   * @returns
   */
  validateEmail = email => {
    return !isUndefined(email) && validator.isEmail(email.trim());
  };

  /**
   *
   * @param {String} phone
   * @returns
   */
  validatePhone = phone => {
    return !isUndefined(phone) && validator.isMobilePhone(phone.trim());
  };

  /**
   *
   * @param {String} password
   * @returns
   */
  validatePassword = password => {
    return (
      !isUndefined(password) && validator.isStrongPassword(password.trim())
    );
  };

  /**
   *
   * @param {String} name
   * @returns
   */
  validateIsName = name => {
    if (isUndefined(name)) return false;
    name = name.trim();
    return isString(name) && !isEmpty(name);
  };

  /**
   *
   * @param {"Student"|"Teacher"} role
   * @returns
   */
  validateRole = role => {
    return role == ROLES.STUDENT || role == ROLES.TEACHER;
  };

  /**
   *
   * @param {"Student"|"Teacher"} role
   * @returns
   */
  validateRadius = radius => {
    if (isUndefined(radius)) return false;
    if (typeof radius === 'string') {
      radius = radius.trim();
      if (isEmpty(radius)) {
        return false;
      }
      radius = Number(radius);
    }
    if (radius < 5 || radius > 100) return false;
    return True;
  };

  /**
   *
   * @param {"Student"|"Teacher"} role
   * @returns
   */
  validatePassingPoints = passingpoints => {
    if (isUndefined(passingpoints)) return false;
    if (typeof passingpoints === 'string') {
      passingpoints = passingpoints.trim();
      if (isEmpty(passingpoints)) {
        return false;
      }
      passingpoints = Number(passingpoints);
    }
    if (passingpoints < 0 || passingpoints > 100) return false;
    return True;
  };

  /**
   *
   * @param {"Student"|"Teacher"} role
   * @returns
   */
  validatePassingPoints = passingpoints => {
    if (isUndefined(passingpoints)) return false;
    if (typeof passingpoints === 'string') {
      passingpoints = passingpoints.trim();
      if (isEmpty(passingpoints)) {
        return false;
      }
      passingpoints = Number(passingpoints);
    }
    if (passingpoints < 0 || passingpoints > 100) return false;
    return True;
  };
}
export default validationServices = new validationServices();
