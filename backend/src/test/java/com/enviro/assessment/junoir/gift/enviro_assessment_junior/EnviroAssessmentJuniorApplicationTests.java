package com.enviro.assessment.junoir.gift.enviro_assessment_junior;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.DashboardSummaryDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.UserRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.service.PortfolioService;

@SpringBootTest
class EnviroAssessmentJuniorApplicationTests {

	@Autowired
	private UserRepo userRepo;

	@Autowired
	private PortfolioService portfolioService;

	@Test
	void contextLoads() {
	}

	@Test
	void dashboardSummaryReturnsPortfolioAndNoticeCountsForLoggedInUser() {
		User john = userRepo.findByUsername("john.doe@enviro365.com").orElseThrow();

		DashboardSummaryDto summary = portfolioService.getDashboardSummary(john.getId());

		assertNotNull(summary);
		assertEquals(970000.0, summary.getTotalPortfolioValue());
		assertEquals(1, summary.getTotalWithdrawalNotices());
		assertEquals(1, summary.getApprovedNotices());
		assertEquals(0, summary.getDeclinedNotices());
	}

}
