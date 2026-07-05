package com.tradelog.dto.analytics;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class SetupPerformanceDTO {
    private String setup;
    private Integer tradeCount;
    private Double totalPnl;
    private Integer wins;
    private Double winRate;
}
