import type { Response } from "@adonisjs/core/http";

type ApiResponseType<T> = {
  data?: T;
  error?: {
    message: string;
    code?: number;
  };
  meta?: {
    page: number;
    per_page: number;
  };
};

/**
 * API Response Utility Class
 * Provides standardized REST API responses with best practices
 */
export class ResponseApi {
  static success<T>(data: T, meta = undefined): ApiResponseType<T> {
    return {
      data,
      meta,
    };
  }

  static error(
    errorMessage?: string,
    errorCode?: number,
  ): ApiResponseType<any> {
    return {
      data: [],
      error: {
        message: errorMessage || "An error occurred",
        code: errorCode,
      },
    };
  }

  static sendError(
    response: Response,
    errorMessage: string,
    statusCode: number = 400,
    errorCode?: number,
  ) {
    return response
      .status(statusCode)
      .json(this.error(errorMessage, errorCode));
  }
}
