package com.tradelog.dto.auth;

import com.tradelog.model.User;
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
    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private Long userId;
    private String name;
    private String email;
    private String mobile;
    private User.Role role;
    private User.UserStatus status;
    private Boolean emailVerified;
    private Boolean mobileVerified;

    /**
     * Static factory method to easily map your core User entity into
     * this flat AuthResponse DTO.
     */
    public static AuthResponse of(String access, String refresh, User u) {
        return AuthResponse.builder()
                .accessToken(access)
                .refreshToken(refresh)
                .tokenType("Bearer")
                .userId(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .mobile(u.getMobile())
                .role(u.getRole())
                .status(u.getStatus())
                .emailVerified(Boolean.TRUE.equals(u.getEmailVerified()))
                .mobileVerified(Boolean.TRUE.equals(u.getMobileVerified()))
                .build();
    }
}