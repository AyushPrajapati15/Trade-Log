package com.tradelog.service;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class SmsService {

    @Value("${twilio.from-number}")
    private String fromNumber;

    @Async
    public void sendOtp(String mobile, String otp) {
        try {
            // Indian numbers need +91 prefix
            String to = mobile.startsWith("+") ? mobile : "+91" + mobile;
            Message.creator(
                new PhoneNumber(to),
                new PhoneNumber(fromNumber),
                "Your TradeLog India OTP is: " + otp + ". Valid for 10 minutes. Do not share."
            ).create();
            log.info("OTP SMS sent to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP SMS to {}: {}", mobile, e.getMessage());
        }
    }
}
