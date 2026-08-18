package com.enviro.assessment.junoir.gift.enviro_assessment_junior.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.DashboardSummaryDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.ProductDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.UserDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.Product;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.WithdrawalNotice;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.WithdrawalStatus;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.exceptions.BaseException;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.ProductRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.UserRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.WithdrawalNoticeRepo;

import java.util.stream.Collectors;

@Service
public class PortfolioService {

        private final UserRepo userRepository;
        private final ProductRepo productRepository;
        private final WithdrawalNoticeRepo withdrawalNoticeRepository;

        public PortfolioService(
                        UserRepo userRepository,
                        ProductRepo productRepository,
                        WithdrawalNoticeRepo withdrawalNoticeRepository) {

                this.userRepository = userRepository;
                this.productRepository = productRepository;
                this.withdrawalNoticeRepository = withdrawalNoticeRepository;
        }

        @Transactional(readOnly = true)
        public UserDto getInvestorPortfolio(String userId) {

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new BaseException(
                                                "Investor not found",
                                                HttpStatus.NOT_FOUND));

                List<Product> products = productRepository.findByUserId(userId);

                List<ProductDto> productDtos = products.stream()
                                .map(product -> ProductDto.builder()
                                                .id(product.getId())
                                                .name(product.getName())
                                                .type(product.getType())
                                                .balance(product.getBalance())
                                                .build())
                                .collect(Collectors.toList());

                return UserDto.builder()
                                .id(user.getId())
                                .name(user.getName())
                                .surname(user.getSurname())
                                .age(user.getAge())
                                .email(user.getEmail())
                                .products(productDtos)
                                .build();
        }

        @Transactional(readOnly = true)
        public DashboardSummaryDto getDashboardSummary(String userId) {
                List<Product> products = productRepository.findByUserId(userId);
                List<WithdrawalNotice> notices = withdrawalNoticeRepository.findByProductUserId(userId);

                double totalValue = products.stream()
                                .mapToDouble(Product::getBalance)
                                .sum();

                int totalNotices = (int) notices.stream()
                                .count();

                int approved = (int) notices.stream()
                                .filter(n -> n.getStatus() == WithdrawalStatus.APPROVED)
                                .count();

                int declined = (int) notices.stream()
                                .filter(n -> n.getStatus() == WithdrawalStatus.DECLINED)
                                .count();

                return DashboardSummaryDto.builder()
                                .totalPortfolioValue(totalValue)
                                .totalWithdrawalNotices(totalNotices)
                                .approvedNotices(approved)
                                .declinedNotices(declined)
                                .build();
        }
}