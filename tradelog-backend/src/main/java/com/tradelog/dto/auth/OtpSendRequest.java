package com.tradelog.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OtpSendRequest {
    @NotBlank private String identifier;  // email or mobile
}
