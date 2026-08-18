package com.enviro.assessment.junoir.gift.enviro_assessment_junior.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.BaseReponseDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.DashboardSummaryDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.UserDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.UserRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.service.PortfolioService;

@RestController
@RequestMapping("/api/investor")
public class PortfolioController {

    private final PortfolioService portfolioService;
    private final UserRepo userRepository;

    public PortfolioController(
            PortfolioService portfolioService,
            UserRepo userRepository) {

        this.portfolioService = portfolioService;
        this.userRepository = userRepository;
    }

    @GetMapping("/portfolio")
    public ResponseEntity<BaseReponseDto<UserDto>> getPortfolio(
            Authentication authentication) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow();

        UserDto portfolio =
                portfolioService.getInvestorPortfolio(user.getId());

        return ResponseEntity.ok(
                BaseReponseDto.<UserDto>builder()
                        .data(portfolio)
                        .message("Portfolio retrieved successfully")
                        .build()
        );
    }

    @GetMapping("/dashboard")
    
    public ResponseEntity<BaseReponseDto<DashboardSummaryDto>> getDashboardSummary(
            Authentication authentication) {

        User user = userRepository
                .findByUsername(authentication.getName())
                .orElseThrow();

        DashboardSummaryDto summary =
                portfolioService.getDashboardSummary(user.getId());

        return ResponseEntity.ok(
                BaseReponseDto.<DashboardSummaryDto>builder()
                        .data(summary)
                        .message("Dashboard summary retrieved successfully")
                        .build()
        );
    }
}