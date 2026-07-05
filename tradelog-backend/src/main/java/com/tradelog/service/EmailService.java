package com.tradelog.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOtp(String to, String otp, String purpose) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail, "TradeLog India");
            helper.setTo(to);
            helper.setSubject("Your TradeLog OTP: " + otp);
            helper.setText(buildOtpEmail(otp, purpose), true);
            mailSender.send(message);
            log.info("OTP email sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}: {}", to, e.getMessage());
        }
    }

    private String buildOtpEmail(String otp, String purpose) {
        return """
            <div style="font-family:Arial,sans-serif;background:#0a0c0f;color:#e8edf5;padding:32px;border-radius:8px;max-width:480px">
              <h2 style="color:#3d9bff;margin-bottom:8px">TradeLog India</h2>
              <p style="color:#8a96a8;font-size:13px">%s</p>
              <div style="background:#13171e;border:1px solid #1e2530;border-radius:6px;padding:24px;text-align:center;margin:24px 0">
                <p style="color:#8a96a8;font-size:12px;margin-bottom:8px;letter-spacing:0.1em">YOUR OTP</p>
                <h1 style="color:#00d68f;font-size:40px;letter-spacing:0.2em;font-family:monospace">%s</h1>
              </div>
              <p style="color:#4a5568;font-size:12px">This OTP expires in 10 minutes. Do not share it with anyone.</p>
            </div>
            """.formatted(purpose, otp);
    }
}
