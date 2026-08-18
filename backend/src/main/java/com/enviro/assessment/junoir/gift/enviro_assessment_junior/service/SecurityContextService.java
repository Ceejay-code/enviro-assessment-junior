package com.enviro.assessment.junoir.gift.enviro_assessment_junior.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.exceptions.BaseException;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.UserRepo;

public interface SecurityContextService {

    default Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new BaseException("Unauthorised access", HttpStatus.UNAUTHORIZED);
        }
        return authentication;
    }

    default String getAuthenticatedUsername() {
        return getAuthentication().getName();
    }

    default User getUser(UserRepo userRepo) {
        String username = getAuthenticatedUsername();
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new BaseException("Authenticated user not found", HttpStatus.UNAUTHORIZED));
    }
}