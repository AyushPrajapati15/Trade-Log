package com.tradelog.dto.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class MobileLoginRequest {
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid mobile number")
    @NotBlank
    private String mobile;

    @NotBlank
    @Size(min = 6, max = 6, message = "OTP must be 6 digits")
    private String otp;
}
