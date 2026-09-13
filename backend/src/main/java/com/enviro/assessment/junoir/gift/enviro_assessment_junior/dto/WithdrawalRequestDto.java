package com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class WithdrawalRequestDto {

    @NotBlank(message = "Product ID is required")
    private String productId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    private Double amount;
}
