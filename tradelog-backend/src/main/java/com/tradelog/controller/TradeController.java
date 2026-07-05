package com.tradelog.controller;

import com.tradelog.dto.TradeDTO;
import com.tradelog.model.Trade;
import com.tradelog.security.JwtUtil;
import com.tradelog.service.TradeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/trades")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService tradeService;
    private final JwtUtil jwtUtil;

    // ── Helper ────────────────────────────────────────────
    private Long getUserId(String authHeader) {
        return jwtUtil.getUserIdFromToken(authHeader.substring(7));
    }

    @GetMapping
    public ResponseEntity<Page<Trade>> getTrades(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Trade.Segment segment,
            @RequestParam(required = false) Trade.Side side,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(required = false) String symbol) {

        Long userId = getUserId(authHeader);
        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "tradeDate", "createdAt"));
        return ResponseEntity.ok(tradeService.getTrades(userId, segment, side, from, to, symbol, pr));
    }

    @PostMapping
    public ResponseEntity<Trade> createTrade(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody TradeDTO dto) {
        return ResponseEntity.ok(tradeService.createTrade(getUserId(authHeader), dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trade> updateTrade(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id,
            @Valid @RequestBody TradeDTO dto) {
        return ResponseEntity.ok(tradeService.updateTrade(getUserId(authHeader), id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTrade(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        tradeService.deleteTrade(getUserId(authHeader), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trade> getTrade(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable Long id) {
        return ResponseEntity.ok(tradeService.getTradeById(getUserId(authHeader), id));
    }
}