package com.tradelog.controller;

import com.tradelog.model.OtpToken;
import com.tradelog.model.User;
import com.tradelog.repository.UserRepository;
import com.tradelog.service.AuthService;
import com.tradelog.service.OtpService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.tradelog.dto.auth.RegisterRequest;
import com.tradelog.dto.auth.LoginRequest;
import com.tradelog.dto.auth.MobileLoginRequest;
import com.tradelog.dto.auth.OtpSendRequest;
import com.tradelog.dto.auth.OtpVerifyRequest;
import com.tradelog.dto.auth.AuthResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final OtpService otpService;
    private final UserRepository userRepository;

    // ── Registration ──────────────────────────────────────────────────

    @PostMapping("/register")
    //VERIFIED
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        String msg = authService.register(req);
        return ResponseEntity.ok(Map.of("message", msg));
    }

    @PostMapping("/send-email-otp")
    //VERIFIED
    public ResponseEntity<?> sendEmailOtp(@RequestBody OtpSendRequest req) {
        User user = userRepository.findByEmail(req.getIdentifier())
                .orElseThrow(() -> new RuntimeException("User not found"));
        otpService.sendEmailOtp(user, OtpToken.OtpType.EMAIL_VERIFY);
        return ResponseEntity.ok(Map.of("message", "OTP sent to " + req.getIdentifier()));
    }

    @PostMapping("/verify-email-otp")
//    VERIFIED
    public ResponseEntity<?> verifyEmailOtp(@RequestBody OtpVerifyRequest req) {
        boolean ok = authService.verifyEmailOtp(req);
        if (!ok) return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        return ResponseEntity.ok(Map.of("message", "Email verified. Please verify your mobile."));
    }

    @PostMapping("/send-mobile-otp")
    //VERIFIED
    public ResponseEntity<?> sendMobileOtp(@RequestBody OtpSendRequest req) {
        User user = userRepository.findByMobile(req.getIdentifier())
                .orElseThrow(() -> new RuntimeException("Mobile not found"));

        OtpToken.OtpType type = user.getEmailVerified()
                ? (user.getMobileVerified() ? OtpToken.OtpType.LOGIN : OtpToken.OtpType.MOBILE_VERIFY)
                : OtpToken.OtpType.MOBILE_VERIFY;
        otpService.sendMobileOtp(user, type);
        return ResponseEntity.ok(Map.of("message", "OTP sent via SMS"));
    }

    @PostMapping("/verify-mobile-otp")
    //VERIFIED
    public ResponseEntity<?> verifyMobileOtp(@RequestBody OtpVerifyRequest req) {
        boolean ok = authService.verifyMobileOtp(req);
        if (!ok) return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
        return ResponseEntity.ok(Map.of("message", "Mobile verified. Account is now active!"));
    }

    // ── Login ─────────────────────────────────────────────────────────

    @PostMapping("/login")
    //VERIFIED
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.loginWithEmail(req));
    }

    @PostMapping("/login/mobile")
    //VERIFIED
    public ResponseEntity<AuthResponse> loginMobile(@RequestBody MobileLoginRequest req) {
        return ResponseEntity.ok(authService.loginWithMobileOtp(req));
    }

    @PostMapping("/login/mobile/send-otp")
    //VERIFIED
    public ResponseEntity<?> sendLoginOtp(@RequestBody OtpSendRequest req) {
        User user = userRepository.findByMobile(req.getIdentifier())
                .orElseThrow(() -> new RuntimeException("Mobile not registered"));
        otpService.sendMobileOtp(user, OtpToken.OtpType.LOGIN);
        return ResponseEntity.ok(Map.of("message", "Login OTP sent"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(authService.refreshToken(body.get("refreshToken")));
    }

    @PostMapping("/logout")
    //VERIFIED
    public ResponseEntity<?> logout() {
        // Client should discard tokens. Stateless — no server-side invalidation needed
        // (add a token blacklist Redis cache for production)
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
