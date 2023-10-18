import validator from 'validator';
import { ROLES } from '../common/constants';
import { isEmpty, isString, isUndefined } from 'lodash';

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
    return !isUndefined(password) && validator.isStrongPassword(password.trim());
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
}

export default validationServices = new validationServices();
