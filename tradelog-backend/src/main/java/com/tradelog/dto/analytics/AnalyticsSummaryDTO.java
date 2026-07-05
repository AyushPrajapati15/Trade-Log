package com.tradelog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryDTO {
    private Integer totalTrades;
    private Integer wins;
    private Integer losses;
    private Double winRate;
    private Double totalPnl;
    private Double avgWin;
    private Double avgLoss;
    private Double profitFactor;
    private Double bestTrade;
    private Double worstTrade;
}
