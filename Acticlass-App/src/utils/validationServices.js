import validator from 'validator';

class validationServices {
  validateEmail = email => {
    return validator.isEmail(email);
  };

  validatePhone = phone => {
    return validator.isMobilePhone(phone);
  };

  validatePassword = password => {
    return validator.isStrongPassword(password);
  };

  validateInstituteName = name => {
    return validator.isAlpha(name);
  };

  validateRole = role => {
    return role == 'Student' || role == 'Teacher';
  };
}

export default validationServices = new validationServices();
