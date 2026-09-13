package com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.WithdrawalNotice;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.enums.WithdrawalStatus;

public interface WithdrawalNoticeRepo extends JpaRepository<WithdrawalNotice, String> {
    List<WithdrawalNotice> findByProductUserId(String userId);
    List<WithdrawalNotice> findByProductIdAndProductUserId(String productId, String userId);
    
    // Spring Data JPA automatically casts the COUNT result to int/Integer
    Integer countByProductUserIdAndStatus(String userId, WithdrawalStatus status);
    Integer countByProductUserId(String userId);
}