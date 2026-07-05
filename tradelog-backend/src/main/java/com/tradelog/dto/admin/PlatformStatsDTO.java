package com.tradelog.dto.admin;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class PlatformStatsDTO {
    private long totalUsers;
    private long activeUsers;
    private long bannedUsers;
    private long unverifiedUsers;
    private long totalTrades;
    private long todayTrades;
    private long todaySignups;
    private long zerodhaUsers;
    private long upstoxUsers;
    private long angelUsers;
}
