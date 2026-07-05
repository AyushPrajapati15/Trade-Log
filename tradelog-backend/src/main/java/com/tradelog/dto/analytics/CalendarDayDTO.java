package com.tradelog.dto.analytics;
import lombok.*;
import java.time.LocalDate;
@Data @NoArgsConstructor @AllArgsConstructor
public class CalendarDayDTO {
    private LocalDate date;
    private Double pnl;
    private Integer tradeCount;
}
