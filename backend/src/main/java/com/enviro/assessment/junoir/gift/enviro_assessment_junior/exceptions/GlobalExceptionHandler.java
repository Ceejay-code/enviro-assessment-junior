package com.enviro.assessment.junoir.gift.enviro_assessment_junior.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.BaseReponseDto;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<BaseReponseDto<Void>> handleBaseException(BaseException ex) {
        BaseReponseDto<Void> response = BaseReponseDto.<Void>builder()
                .message(ex.getMessage())
                .build();

        HttpStatus rawStatus = ex.getStatus();
        HttpStatusCode status = (rawStatus != null) ? rawStatus : HttpStatus.INTERNAL_SERVER_ERROR;

        return new ResponseEntity<>(response, status);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<BaseReponseDto<Void>> handleValidationException(MethodArgumentNotValidException ex) {
        FieldError fieldError = ex.getBindingResult().getFieldError();
        String errorMessage = (fieldError != null && fieldError.getDefaultMessage() != null)
                ? fieldError.getDefaultMessage()
                : "Validation failed";

        BaseReponseDto<Void> response = BaseReponseDto.<Void>builder()
                .message(errorMessage)
                .build();

        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}