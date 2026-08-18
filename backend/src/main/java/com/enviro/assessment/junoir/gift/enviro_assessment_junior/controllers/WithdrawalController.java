package com.enviro.assessment.junoir.gift.enviro_assessment_junior.controllers;

import java.io.IOException;
import java.util.List;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.BaseReponseDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.WithdrawalRequestDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.WithdrawalNotice;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.service.WithdrawalService;

@RestController
@RequestMapping("/api/investor/withdrawals")
public class WithdrawalController {

        private final WithdrawalService withdrawalService;

        public WithdrawalController(
                        WithdrawalService withdrawalService) {

                this.withdrawalService = withdrawalService;
        }

        @PostMapping
        public ResponseEntity<BaseReponseDto<WithdrawalNotice>> createNotice(
                        @Valid @RequestBody WithdrawalRequestDto request) {

                WithdrawalNotice notice = withdrawalService.createWithdrawal(
                                request);

                return ResponseEntity.ok(
                                BaseReponseDto.<WithdrawalNotice>builder()
                                                .data(notice)
                                                .message(
                                                                "Withdrawal notice created successfully")
                                                .build());
        }

        @GetMapping("/product/{productId}")
        public ResponseEntity<BaseReponseDto<List<WithdrawalNotice>>> getHistory(
                        @PathVariable String productId) {

                List<WithdrawalNotice> notices = withdrawalService
                                .getWithdrawalsByProductForUser(
                                                productId);

                System.out.println("Withdrawal notices returned: " + notices.size());

                for (WithdrawalNotice notice : notices) {
                        System.out.println(
                                        "Notice ID: " + notice.getId()
                                                        + " | Product: " + notice.getProduct().getName()
                                                        + " | Amount: " + notice.getAmount()
                                                        + " | Status: " + notice.getStatus());
                }

                return ResponseEntity.ok(
                                BaseReponseDto.<List<WithdrawalNotice>>builder()
                                                .data(notices)
                                                .message(
                                                                "Withdrawal history retrieved successfully")
                                                .build());
        }

        @GetMapping("/export-csv")
        public void exportToCsv(
                        HttpServletResponse response)
                        throws IOException {

                response.setContentType("text/csv");

                response.setHeader(
                                "Content-Disposition",
                                "attachment; filename=\"withdrawals.csv\"");

                withdrawalService.exportCsv(
                                response.getWriter());
        }
}