package com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;

public interface UserRepo extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
}
