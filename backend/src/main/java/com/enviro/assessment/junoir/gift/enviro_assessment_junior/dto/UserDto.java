package com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserDto {

    private String id;
    private String name;
    private String surname;
    private int age;
    private String email;
    private List<ProductDto> products;
}