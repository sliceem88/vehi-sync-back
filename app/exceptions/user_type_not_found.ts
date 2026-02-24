import { Exception } from "@adonisjs/core/exceptions";

import { ExceptionCode } from "#exceptions/exception_code";

export default class UserTypeNotFoundException extends Exception {
  static status = 404;
  static code = ExceptionCode.USER_TYPE_NOT_FOUND.toString();

  constructor() {
    super("User type not found");
  }
}
