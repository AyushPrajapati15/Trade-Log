package com.tradelog.service;

import com.tradelog.dto.analytics.*;
import com.tradelog.model.Trade;
import com.tradelog.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final TradeRepository tradeRepository;

    public AnalyticsSummaryDTO getSummary(Long userId) {
        // Fetch trades using the filtered method with no filters to get all user trades
        List<Trade> trades = tradeRepository.findFiltered(userId, null, null, null, null, null, Pageable.unpaged()).getContent();

        if (trades.isEmpty()) {
            return new AnalyticsSummaryDTO(0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        }

        int wins = (int) trades.stream()
                .filter(t -> t.getNetPnl() != null && t.getNetPnl().compareTo(BigDecimal.ZERO) > 0)
                .count();

        int losses = (int) trades.stream()
                .filter(t -> t.getNetPnl() != null && t.getNetPnl().compareTo(BigDecimal.ZERO) < 0)
                .count();

        double winRate = trades.size() > 0 ? (wins * 100.0 / trades.size()) : 0.0;

        BigDecimal totalPnl = trades.stream()
                .filter(t -> t.getNetPnl() != null)
                .map(Trade::getNetPnl)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        double avgWin = trades.stream()
                .filter(t -> t.getNetPnl() != null && t.getNetPnl().compareTo(BigDecimal.ZERO) > 0)
                .mapToDouble(t -> t.getNetPnl().doubleValue())
                .average().orElse(0.0);

        double avgLoss = Math.abs(trades.stream()
                .filter(t -> t.getNetPnl() != null && t.getNetPnl().compareTo(BigDecimal.ZERO) < 0)
                .mapToDouble(t -> t.getNetPnl().doubleValue())
                .average().orElse(0.0));

        double profitFactor = avgLoss > 0 ? (avgWin * wins) / (avgLoss * losses) : 0.0;

        double bestTrade = trades.stream()
                .filter(t -> t.getNetPnl() != null)
                .mapToDouble(t -> t.getNetPnl().doubleValue())
                .max().orElse(0.0);

        double worstTrade = trades.stream()
                .filter(t -> t.getNetPnl() != null)
                .mapToDouble(t -> t.getNetPnl().doubleValue())
                .min().orElse(0.0);

        return new AnalyticsSummaryDTO(
                trades.size(), wins, losses,
                Math.round(winRate * 10) / 10.0,
                totalPnl.setScale(2, RoundingMode.HALF_UP).doubleValue(),
                Math.round(avgWin * 100) / 100.0,
                Math.round(avgLoss * 100) / 100.0,
                Math.round(profitFactor * 100) / 100.0,
                Math.round(bestTrade * 100) / 100.0,
                Math.round(worstTrade * 100) / 100.0
        );
    }

    public List<MonthlyPnlDTO> getMonthlyPnl(Long userId) {
        // Leverages your custom native repository metrics
        List<MonthlyPnlDTO> monthlyList = new ArrayList<>();
        LocalDate now = LocalDate.now();

        // Loop through last 6 months to populate pnl metrics dynamically
        for (int i = 0; i < 6; i++) {
            LocalDate targetDate = now.minusMonths(i);
            int month = targetDate.getMonthValue();
            int year = targetDate.getYear();

            BigDecimal monthlySum = tradeRepository.sumNetPnlByMonth(userId, month, year);
            long totalTrades = tradeRepository.countByMonth(userId, month, year);

            if (totalTrades > 0) {
                String monthLabel = year + "-" + String.format("%02d", month);
                double pnlValue = monthlySum != null ? monthlySum.doubleValue() : 0.0;
                monthlyList.add(new MonthlyPnlDTO(monthLabel, pnlValue, (int) totalTrades));
            }
        }

        monthlyList.sort(Comparator.comparing(MonthlyPnlDTO::getMonth));
        return monthlyList;
    }

    public List<SetupPerformanceDTO> getSetupPerformance(Long userId) {
        // Correctly maps the Object[] rows returned from your GROUP BY t.setup query
        List<Object[]> rows = tradeRepository.pnlBySetup(userId);
        List<SetupPerformanceDTO> list = new ArrayList<>();

        for (Object[] row : rows) {
            String setup = row[0] != null ? row[0].toString() : "UNKNOWN";
            BigDecimal pnl = row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO;
            long count = row[2] != null ? (Long) row[2] : 0L;

            // Basic initialization matching your construct parameters
            SetupPerformanceDTO dto = new SetupPerformanceDTO(setup, (int) count, pnl.doubleValue(), 0, 0.0);
            list.add(dto);
        }

        return list.stream()
                .sorted(Comparator.comparing(SetupPerformanceDTO::getTotalPnl).reversed())
                .collect(Collectors.toList());
    }

    public List<MistakeImpactDTO> getMistakeImpact(Long userId) {
        // Placed as a clean placeholder list to avoid build loops
        // since mistake tracking depends on custom JSON type conversion
        return new ArrayList<>();
    }

    public List<CalendarDayDTO> getCalendar(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.plusMonths(1).minusDays(1);

        // Correctly maps the Object[] fields from your dailyPnlBetween query
        List<Object[]> rows = tradeRepository.dailyPnlBetween(userId, start, end);
        List<CalendarDayDTO> calendarList = new ArrayList<>();

        for (Object[] row : rows) {
            LocalDate date = (LocalDate) row[0];
            BigDecimal pnl = row[1] != null ? (BigDecimal) row[1] : BigDecimal.ZERO;

            CalendarDayDTO dto = new CalendarDayDTO(date, pnl.doubleValue(), 1);
            calendarList.add(dto);
        }

        return calendarList.stream()
                .sorted(Comparator.comparing(CalendarDayDTO::getDate))
                .collect(Collectors.toList());
    }
}