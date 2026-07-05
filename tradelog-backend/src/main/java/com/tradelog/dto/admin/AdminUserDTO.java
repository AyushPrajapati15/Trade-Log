package com.tradelog.dto.admin;

import com.tradelog.model.User;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data @Builder
public class AdminUserDTO {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private User.Role role;
    private User.UserStatus status;
    private User.Broker broker;
    private Boolean emailVerified;
    private Boolean mobileVerified;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
    private Long tradeCount;
}
