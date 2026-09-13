package com.enviro.assessment.junoir.gift.enviro_assessment_junior.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.BaseReponseDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.DashboardSummaryDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.UserDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.service.PortfolioService;

@RestController
@RequestMapping("/api/investor")
public class PortfolioController {

    private final PortfolioService portfolioService;

        public PortfolioController(PortfolioService portfolioService) {

        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio")
        public ResponseEntity<BaseReponseDto<UserDto>> getPortfolio() {
                UserDto portfolio = portfolioService.getAuthenticatedInvestorPortfolio();

        return ResponseEntity.ok(
                BaseReponseDto.<UserDto>builder()
                        .data(portfolio)
                        .build()
        );
    }

    @GetMapping("/dashboard")
    
        public ResponseEntity<BaseReponseDto<DashboardSummaryDto>> getDashboardSummary() {
                DashboardSummaryDto summary = portfolioService.getAuthenticatedDashboardSummary();

        return ResponseEntity.ok(
                BaseReponseDto.<DashboardSummaryDto>builder()
                        .data(summary)
                        .build()
        );
    }
}