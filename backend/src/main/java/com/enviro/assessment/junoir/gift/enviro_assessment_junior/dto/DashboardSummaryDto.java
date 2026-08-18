package com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDto {
    private Double totalPortfolioValue;
    private Integer totalWithdrawalNotices;
    private Integer approvedNotices;
    private Integer declinedNotices;
}