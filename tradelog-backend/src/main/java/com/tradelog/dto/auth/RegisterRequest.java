package com.tradelog.dto.auth;

import com.tradelog.model.User.Broker;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Name is required") @Size(min = 2, max = 100)
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;


    @NotBlank(message = "Mobile is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter a valid 10-digit Indian mobile number")
    private String mobile;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private Broker broker;
}
