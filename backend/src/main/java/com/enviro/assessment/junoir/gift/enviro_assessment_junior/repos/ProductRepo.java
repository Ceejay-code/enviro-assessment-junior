package com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.Product;

public interface ProductRepo extends JpaRepository<Product, String> {

    List<Product> findByUserId(String userId);

    Optional<Product> findByIdAndUserId(String productId, String userId);
}