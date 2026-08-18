package com.enviro.assessment.junoir.gift.enviro_assessment_junior.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.AuthRequest;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.dto.AuthResponse;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.entities.User;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.repos.UserRepo;
import com.enviro.assessment.junoir.gift.enviro_assessment_junior.security.JwtTokenProvider;

@Service
public class AuthService {

        private final AuthenticationManager authenticationManager;
        private final JwtTokenProvider tokenProvider;
        private final UserRepo userRepository;

        public AuthService(
                        AuthenticationManager authenticationManager,
                        JwtTokenProvider tokenProvider,
                        UserRepo userRepository) {

                this.authenticationManager = authenticationManager;
                this.tokenProvider = tokenProvider;
                this.userRepository = userRepository;
        }

        public AuthResponse authenticate(AuthRequest request) {

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.getUsername(),
                                                request.getPassword()));

                User user = userRepository.findByUsername(request.getUsername())
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // We pass the user object here so claims are attached to the token
                String token = tokenProvider.generateToken(user);

                return AuthResponse.builder()
                                .accessToken(token)
                                .tokenType("Bearer")
                                .userId(user.getId())
                                .username(user.getUsername())
                                .name(user.getName())
                                .surname(user.getSurname())
                                .email(user.getEmail())
                                .role(user.getRole().name())
                                .build();
        }
}