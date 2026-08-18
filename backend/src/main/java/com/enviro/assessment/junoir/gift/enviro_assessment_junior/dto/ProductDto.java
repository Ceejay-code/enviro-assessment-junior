package com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.ProductType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private String id;

    private String name;

    private ProductType type;

    private Double balance;
}