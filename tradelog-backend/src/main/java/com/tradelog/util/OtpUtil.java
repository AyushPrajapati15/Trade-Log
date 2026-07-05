package com.tradelog.util;

import org.springframework.stereotype.Component;
import java.security.SecureRandom;

@Component
public class OtpUtil {
    private static final SecureRandom random = new SecureRandom();

    public String generate() {
        return String.format("%06d", random.nextInt(1_000_000));
    }
}
