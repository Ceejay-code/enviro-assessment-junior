package com.enviro.assessment.junoir.gift.enviro_assessment_junior.controllers;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.AuthRequest;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.AuthResponse;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.BaseReponseDto;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<BaseReponseDto<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(
                BaseReponseDto.<AuthResponse>builder()
                        .data(response)
                        .message("Authentication successful")
                        .build());
    }
}