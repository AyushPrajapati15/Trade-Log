package com.tradelog.dto;

import com.tradelog.model.Trade.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class TradeDTO {
    private Long id;

    @NotNull private LocalDate tradeDate;
    @NotBlank @Size(max = 50) private String symbol;
    @NotNull private Segment segment;
    @NotNull private Side side;
    @NotNull @DecimalMin("0.01") private BigDecimal entryPrice;
    @NotNull @DecimalMin("0.01") private BigDecimal exitPrice;
    @NotNull @DecimalMin("0.0001") private BigDecimal quantity;
    private BigDecimal stopLoss;
    private BigDecimal target;
    private BigDecimal brokerage;
    private String setup;
    private String emotion;
    private List<String> mistakeTags;
    private String notes;

    // computed — returned in response
    private BigDecimal grossPnl;
    private BigDecimal netPnl;
    private TradeSource source;
}
