package com.tradelog.service;

import com.tradelog.model.OtpToken;
import com.tradelog.model.User;
import com.tradelog.repository.OtpRepository;
import com.tradelog.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final OtpUtil otpUtil;
    private final EmailService emailService;
    private final SmsService smsService;

    @Value("${app.otp-expiry-minutes}")
    private int expiryMinutes;

    @Transactional
    public void sendEmailOtp(User user, OtpToken.OtpType type) {
        otpRepository.invalidateAll(user.getEmail(), type);
        String code = otpUtil.generate();
        otpRepository.save(OtpToken.builder()
                .user(user)
                .identifier(user.getEmail())
                .otpCode(code)
                .type(type)
                .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
                .build());
        String purpose = type == OtpToken.OtpType.EMAIL_VERIFY
                ? "Please verify your email address to activate your TradeLog account."
                : "Use this OTP to log in to TradeLog India.";
        emailService.sendOtp(user.getEmail(), code, purpose);
    }

    @Transactional
    public void sendMobileOtp(User user, OtpToken.OtpType type) {
        otpRepository.invalidateAll(user.getMobile(), type);
        String code = otpUtil.generate();
        otpRepository.save(OtpToken.builder()
                .user(user)
                .identifier(user.getMobile())
                .otpCode(code)
                .type(type)
                .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
                .build());
        smsService.sendOtp(user.getMobile(), code);
    }

    @Transactional
    public boolean verifyOtp(String identifier, String code, OtpToken.OtpType type) {
        return otpRepository
                .findTopByIdentifierAndTypeAndUsedFalseOrderByIdDesc(identifier, type)
                .filter(o -> !o.getExpiresAt().isBefore(LocalDateTime.now()))
                .filter(o -> o.getOtpCode().equals(code))
                .map(o -> { o.setUsed(true); otpRepository.save(o); return true; })
                .orElse(false);
    }

    // Clean up expired OTPs every 30 minutes
    @Scheduled(fixedDelay = 1_800_000)
    @Transactional
    public void purgeExpired() {
        otpRepository.hardDeleteExpired(LocalDateTime.now());
    }
}
