package com.enviro.assessment.junoir.gift.enviro_assessment_junior.exceptions;

import org.springframework.http.HttpStatus;

public class BaseException extends RuntimeException {
  /**
   * 
   */
  private static final long serialVersionUID = 1L;

  private final HttpStatus status;

  public BaseException(String message) {
    super(message);
    this.status = HttpStatus.BAD_REQUEST;
  }

  public BaseException(HttpStatus status) {
    super("");
    this.status = status;
  }

  public BaseException(String message, HttpStatus status) {
    super(message);
    this.status = status;
  }

  public HttpStatus getStatus() {
    return status;
  }

}
