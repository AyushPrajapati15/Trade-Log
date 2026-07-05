package com.tradelog.controller;

import com.tradelog.dto.analytics.*;
import com.tradelog.security.JwtUtil;
import com.tradelog.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    private final JwtUtil jwtUtil;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getSummary(userId));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyPnlDTO>> getMonthlyPnl(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getMonthlyPnl(userId));
    }

    @GetMapping("/by-setup")
    public ResponseEntity<List<SetupPerformanceDTO>> getSetupPerformance(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getSetupPerformance(userId));
    }

    @GetMapping("/mistakes")
    public ResponseEntity<List<MistakeImpactDTO>> getMistakeImpact(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getMistakeImpact(userId));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarDayDTO>> getCalendar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        LocalDate now = LocalDate.now();
        int y = year != null ? year : now.getYear();
        int m = month != null ? month : now.getMonthValue();
        return ResponseEntity.ok(analyticsService.getCalendar(userId, y, m));
    }
}
