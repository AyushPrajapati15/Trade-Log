package com.tradelog.dto.analytics;
import lombok.*;
@Data @NoArgsConstructor @AllArgsConstructor
public class MonthlyPnlDTO {
    private String month;
    private Double pnl;
    private Integer tradeCount;
}
