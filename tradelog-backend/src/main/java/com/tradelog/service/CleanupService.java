package com.tradelog.service;

import com.tradelog.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class CleanupService {

    private final UserRepository      userRepository;
    private final TradeRepository     tradeRepository;
    private final OtpRepository       otpRepository;
    private final ImportLogRepository importLogRepository;

    // ── Runs every Sunday at midnight ─────────────────────
    // Cron: second minute hour day month weekday
    // "0 0 0 * * SUN" = 00:00:00 every Sunday
    @Scheduled(cron = "0 0 0 * * SUN")
    @Transactional
    public void weeklyHardDelete() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);
        log.info("Running weekly hard delete. Cutoff: {}", cutoff);

        int trades     = tradeRepository.hardDeleteSoftDeleted(cutoff);
        int otps       = otpRepository.hardDeleteSoftDeleted(cutoff);
        int importLogs = importLogRepository.hardDeleteSoftDeleted(cutoff);
        int users      = userRepository.hardDeleteSoftDeleted(cutoff);

        log.info("Weekly cleanup done — Trades: {}, OTPs: {}, ImportLogs: {}, Users: {}",
                trades, otps, importLogs, users);
    }

    // ── Runs every day at 2am — cleans expired OTPs only ──
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void dailyOtpCleanup() {
        LocalDateTime now = LocalDateTime.now();
        int deleted = otpRepository.hardDeleteExpired(now);
        log.info("Daily OTP cleanup — deleted {} expired tokens", deleted);
    }
}
