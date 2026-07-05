package com.tradelog.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

public class ResponseDTOs { // <-- Main public class matching the filename

    // ── Analytics ─────────────────────────────────────────────────
    @Data
    public static class AnalyticsResponse { // <-- Changed to nested static class

        @Data
        public static class Summary {
            public long totalTrades;
            public long wins;
            public long losses;
            public double winRate;           // percentage
            public BigDecimal totalNetPnl;
            public BigDecimal avgWin;
            public BigDecimal avgLoss;
            public BigDecimal profitFactor;
            public BigDecimal bestTrade;
            public BigDecimal worstTrade;
            public BigDecimal expectancy;
        }

        @Data
        public static class MonthlyPoint {
            public int year;
            public int month;
            public BigDecimal netPnl;
        }

        @Data
        public static class SetupPoint {
            public String setup;
            public BigDecimal netPnl;
            public long tradeCount;
        }

        @Data
        public static class SegmentPoint {
            public String segment;
            public BigDecimal netPnl;
            public long tradeCount;
        }

        @Data
        public static class DailyPnl {
            public LocalDate date;
            public BigDecimal netPnl;
        }

        @Data
        public static class MistakeImpact {
            public String tag;
            public long count;
            public BigDecimal totalPnlImpact;
        }
    }

    // ── Admin DTOs ────────────────────────────────────────────────
    @Data
    public static class AdminDTOs { // <-- Changed to nested static class

        @Data
        public static class PlatformStats {
            public long totalUsers;
            public long activeUsers;       // logged in last 7 days
            public long bannedUsers;
            public long newUsersToday;
            public long totalTrades;
            public long tradesToday;
            public BigDecimal totalPnlToday;
            public Map<String, Long> usersByBroker;
            public Map<String, Long> tradesBySegment;
        }

        @Data
        public static class AdminUserDTO {
            public Long id;
            public String name;
            public String email;
            public String mobile;
            public String broker;
            public String role;
            public String status;
            public boolean emailVerified;
            public boolean mobileVerified;
            public long tradeCount;
            public String createdAt;
            public String lastLogin;
        }
    }
} // <-- Closes ResponseDTOs