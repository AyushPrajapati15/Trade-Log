package com.tradelog.dto;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String broker;
    private String role;
    private String status;
    private Boolean emailVerified;
    private Boolean mobileVerified;
    private String createdAt;
    private String lastLogin;
}
