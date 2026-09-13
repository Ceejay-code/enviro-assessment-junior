package com.enviro.assessment.junoir.gift.enviro_assessment_junior;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.Product;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.WithdrawalNotice;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.ProductType;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.UserRole;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.WithdrawalStatus;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.ProductRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.UserRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.WithdrawalNoticeRepo;

@SpringBootApplication
public class EnviroAssessmentJuniorApplication {

        public static void main(String[] args) {
                SpringApplication.run(EnviroAssessmentJuniorApplication.class, args);
        }

        @Bean
        CommandLineRunner runner(
                        UserRepo userRepo,
                        ProductRepo productRepo,
                        WithdrawalNoticeRepo withdrawalNoticeRepo,
                        PasswordEncoder passwordEncoder) {

                return args -> {

                        /*
                         * ============================================================
                         * 1. USERS / INVESTORS
                         * ============================================================
                         */

                        User sarah = User.builder()
                                        .id(UUID.randomUUID().toString())
                                        .username("sarah.smith@enviro365.com")
                                        .password(passwordEncoder.encode("investor123"))
                                        .name("Sarah")
                                        .surname("Smith")
                                        .age(70)
                                        .email("sarah.smith@enviro365.com")
                                        .role(UserRole.INVESTOR)
                                        .build();

                        User david = User.builder()
                                        .id(UUID.randomUUID().toString())
                                        .username("david.miller@enviro365.com")
                                        .password(passwordEncoder.encode("investor123"))
                                        .name("David")
                                        .surname("Miller")
                                        .age(66)
                                        .email("david.miller@enviro365.com")
                                        .role(UserRole.INVESTOR)
                                        .build();

                        User thandi = User.builder()
                                        .id(UUID.randomUUID().toString())
                                        .username("thandi.mokoena@enviro365.com")
                                        .password(passwordEncoder.encode("investor123"))
                                        .name("Thandi")
                                        .surname("Mokoena")
                                        .age(41)
                                        .email("thandi.mokoena@enviro365.com")
                                        .role(UserRole.INVESTOR)
                                        .build();

                        User liam = User.builder()
                                        .id(UUID.randomUUID().toString())
                                        .username("liam.wilson@enviro365.com")
                                        .password(passwordEncoder.encode("investor123"))
                                        .name("Liam")
                                        .surname("Wilson")
                                        .age(35)
                                        .email("liam.wilson@enviro365.com")
                                        .role(UserRole.INVESTOR)
                                        .build();

                        userRepo.save(Objects.requireNonNull(sarah));
                        userRepo.save(Objects.requireNonNull(david));
                        userRepo.save(Objects.requireNonNull(thandi));
                        userRepo.save(Objects.requireNonNull(liam));

                        /*
                         * ============================================================
                         * 2. PRODUCTS
                         * ============================================================
                         */

                        Product thandiRetirement = Product.builder()
                                        .id(UUID.randomUUID().toString())
                                        .name("Retirement Annuity")
                                        .type(ProductType.RETIREMENT)
                                        .balance(842150.00)
                                        .user(thandi)
                                        .build();

                        Product thandiSavings = Product.builder()
                                        .id(UUID.randomUUID().toString())
                                        .name("Tax-Free Savings")
                                        .type(ProductType.SAVINGS)
                                        .balance(125400.00)
                                        .user(thandi)
                                        .build();

                        Product sarahSavings = Product.builder()
                                        .id(UUID.randomUUID().toString())
                                        .name("Tax-Free Savings")
                                        .type(ProductType.SAVINGS)
                                        .balance(200000.00)
                                        .user(sarah)
                                        .build();

                        Product davidRetirement = Product.builder()
                                        .id(UUID.randomUUID().toString())
                                        .name("Retirement Annuity")
                                        .type(ProductType.RETIREMENT)
                                        .balance(650000.00)
                                        .user(david)
                                        .build();

                        Product liamSavings = Product.builder()
                                        .id(UUID.randomUUID().toString())
                                        .name("Tax-Free Savings")
                                        .type(ProductType.SAVINGS)
                                        .balance(75000.00)
                                        .user(liam)
                                        .build();

                        productRepo.save(Objects.requireNonNull(thandiRetirement));
                        productRepo.save(Objects.requireNonNull(thandiSavings));
                        productRepo.save(Objects.requireNonNull(sarahSavings));
                        productRepo.save(Objects.requireNonNull(davidRetirement));
                        productRepo.save(Objects.requireNonNull(liamSavings));

                        /*
                         * ============================================================
                         * 3. WITHDRAWAL HISTORY
                         * ============================================================
                         */

                        WithdrawalNotice notice1 = WithdrawalNotice.builder()
                                        .id(UUID.randomUUID().toString())
                                        .product(thandiSavings)
                                        .amount(5000.00)
                                        .status(WithdrawalStatus.DECLINED)
                                        .openingBalance(130400.00)
                                        .closingBalance(125400.00)
                                        .createdAt(LocalDateTime.now().minusDays(1))
                                        .build();

                        withdrawalNoticeRepo.save(Objects.requireNonNull(notice1));

                        /*
                         * ============================================================
                         * 4. DATABASE SEEDING COMPLETE
                         * ============================================================
                         */

                        System.out.println("==========================================");
                        System.out.println("Database successfully seeded.");
                        System.out.println("------------------------------------------");
                        System.out.println("Users created : 4");
                        System.out.println("Products created : 5");
                        System.out.println("Withdrawal notices created : 1");
                        System.out.println("==========================================");
                };
        }
}