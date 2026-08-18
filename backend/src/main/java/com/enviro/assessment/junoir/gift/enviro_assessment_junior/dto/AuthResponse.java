package com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;

    private String tokenType;

    private String userId;

    private String username;

    private String name;

    private String surname;

    private String email;

    private String role;
}