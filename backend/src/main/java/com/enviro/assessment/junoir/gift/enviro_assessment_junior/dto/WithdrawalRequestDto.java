package com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WithdrawalRequestDto {

    @NotNull(message = "Product ID is required")
    private String productId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private Double amount;
}
