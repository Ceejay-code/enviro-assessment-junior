package com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BaseReponseDto<T> {
    private T data;
    private String message;
}