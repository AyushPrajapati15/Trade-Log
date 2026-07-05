package com.tradelog.service;

import com.tradelog.dto.auth.*;
import com.tradelog.model.OtpToken;
import com.tradelog.model.User;
import com.tradelog.repository.UserRepository;
import com.tradelog.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final OtpService otpService;

    @Transactional
    public String register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new RuntimeException("Email already registered");
        if (userRepository.existsByMobile(req.getMobile()))
            throw new RuntimeException("Mobile already registered");

        User user = userRepository.save(User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .mobile(req.getMobile())
                .password(passwordEncoder.encode(req.getPassword()))
                .broker(req.getBroker() != null ? req.getBroker() : User.Broker.NONE)
                .status(User.UserStatus.UNVERIFIED)
                .role(User.Role.USER)
                .build());

        otpService.sendEmailOtp(user, OtpToken.OtpType.EMAIL_VERIFY);
        return "Registration successful. Please verify your email.";
    }

    @Transactional
    public boolean verifyEmailOtp(OtpVerifyRequest req) {
        User user = userRepository.findByEmail(req.getIdentifier())
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean ok = otpService.verifyOtp(req.getIdentifier(), req.getOtp(), OtpToken.OtpType.EMAIL_VERIFY);
        if (ok) {
            user.setEmailVerified(true);
            userRepository.save(user);
        }
        return ok;
    }

    @Transactional
    public boolean verifyMobileOtp(OtpVerifyRequest req) {
        User user = userRepository.findByMobile(req.getIdentifier())
                .orElseThrow(() -> new RuntimeException("User not found"));
        boolean ok = otpService.verifyOtp(req.getIdentifier(), req.getOtp(), OtpToken.OtpType.MOBILE_VERIFY);
        if (ok) {
            user.setMobileVerified(true);
            user.setStatus(User.UserStatus.ACTIVE);  // fully verified
            userRepository.save(user);
        }
        return ok;
    }

    public AuthResponse loginWithEmail(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPassword()))
            throw new RuntimeException("Invalid email or password");
        if (user.getStatus() == User.UserStatus.BANNED)
            throw new RuntimeException("Account is banned. Contact support.");
        if (user.getStatus() == User.UserStatus.UNVERIFIED)
            throw new RuntimeException("Please verify your email and mobile first.");

        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse loginWithMobileOtp(MobileLoginRequest req) {
        User user = userRepository.findByMobile(req.getMobile())
                .orElseThrow(() -> new RuntimeException("Mobile number not found"));
        if (user.getStatus() == User.UserStatus.BANNED)
            throw new RuntimeException("Account is banned.");

        boolean ok = otpService.verifyOtp(req.getMobile(), req.getOtp(), OtpToken.OtpType.LOGIN);
        if (!ok) throw new RuntimeException("Invalid or expired OTP");

        user.setLastLogin(java.time.LocalDateTime.now());
        userRepository.save(user);
        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken))
            throw new RuntimeException("Invalid refresh token");
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        return AuthResponse.builder()
                .accessToken(jwtUtil.generateAccessToken(user))
                .refreshToken(jwtUtil.generateRefreshToken(user))
                .tokenType("Bearer")
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole())
                .status(user.getStatus())
                .emailVerified(user.getEmailVerified())
                .mobileVerified(user.getMobileVerified())
                .build();
    }
}
