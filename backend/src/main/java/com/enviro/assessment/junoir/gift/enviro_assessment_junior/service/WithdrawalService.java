package com.enviro.assessment.junoir.gift.enviro_assessment_junior.service;

import java.io.PrintWriter;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.WithdrawalRequestDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.Product;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.WithdrawalNotice;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.ProductType;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.WithdrawalStatus;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.exceptions.BaseException;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.ProductRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.UserRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.WithdrawalNoticeRepo;

@Service
public class WithdrawalService implements SecurityContextService {

        private final ProductRepo productRepository;
        private final WithdrawalNoticeRepo withdrawalNoticeRepository;
        private final UserRepo userRepository;

        public WithdrawalService(
                        ProductRepo productRepository,
                        WithdrawalNoticeRepo withdrawalNoticeRepository,
                        UserRepo userRepository) {

                this.productRepository = productRepository;
                this.withdrawalNoticeRepository = withdrawalNoticeRepository;
                this.userRepository = userRepository;
        }

        @Transactional
        public WithdrawalNotice createWithdrawal(
                        WithdrawalRequestDto request) {
                User user = getUser(userRepository);
                Product product = productRepository
                                .findByIdAndUserId(
                                                request.getProductId(),
                                                user.getId())
                                .orElseThrow(() -> new BaseException(
                                                "Product not found or does not belong to the authenticated investor",
                                                HttpStatus.NOT_FOUND));

                Double balance = product.getBalance();
                Double amount = request.getAmount();

                if (amount > balance) {

                        throw new BaseException(
                                        "Withdrawal amount cannot exceed total account balance",
                                        HttpStatus.BAD_REQUEST);
                }

                Double maxAllowed = balance * 0.90;

                if (amount > maxAllowed) {

                        throw new BaseException(
                                        "Withdrawal amount cannot exceed 90% of current balance",
                                        HttpStatus.BAD_REQUEST);
                }

                WithdrawalStatus status = WithdrawalStatus.APPROVED;
                if (product.getType().equals(ProductType.RETIREMENT) && user.getAge() <= 65) {
                        status = WithdrawalStatus.DECLINED;
                }

                Double newBalance = balance;
                if (status == WithdrawalStatus.APPROVED) {
                        newBalance = balance - amount;
                        product.setBalance(newBalance);
                        productRepository.save(product);
                }

                WithdrawalNotice notice = WithdrawalNotice.builder()
                                .id(java.util.UUID.randomUUID().toString())
                                .product(product)
                                .amount(amount)
                                .openingBalance(balance)
                                .closingBalance(newBalance)
                                .status(status)
                                .createdAt(LocalDateTime.now())
                                .build();

                return withdrawalNoticeRepository.save(notice);
        }

        @Transactional(readOnly = true)
        public List<WithdrawalNotice> getWithdrawalsByProductForUser(
                        String productId) {
                User user = getUser(userRepository);

                Product product = productRepository
                                .findByIdAndUserId(productId, user.getId())
                                .orElseThrow(() -> new BaseException(
                                                "Product not found or does not belong to the authenticated investor",
                                                HttpStatus.NOT_FOUND));

                return withdrawalNoticeRepository
                                .findByProductUserId(product.getUser().getId());
        }

        public void exportCsv(PrintWriter writer) {

                List<WithdrawalNotice> notices = withdrawalNoticeRepository.findAll();

                writer.println(
                                "Notice ID,Product ID,Opening Balance,Amount Requested,Closing Balance,Status,Created At");

                for (WithdrawalNotice notice : notices) {

                        writer.println(
                                        String.format(
                                                        "%s,%s,%.2f,%.2f,%.2f,%s,%s",
                                                        notice.getId(),
                                                        notice.getProduct().getId(),
                                                        notice.getOpeningBalance(),
                                                        notice.getAmount(),
                                                        notice.getClosingBalance(),
                                                        notice.getStatus(),
                                                        notice.getCreatedAt()));
                }
        }
}