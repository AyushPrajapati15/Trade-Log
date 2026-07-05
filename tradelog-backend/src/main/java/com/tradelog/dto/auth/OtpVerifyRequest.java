package com.tradelog.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OtpVerifyRequest {
    @NotBlank private String identifier;

    @Size(min = 6, max = 6)
    @NotBlank private String otp;
}
