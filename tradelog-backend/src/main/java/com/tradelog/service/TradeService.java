package com.tradelog.service;

import com.tradelog.dto.TradeDTO;
import com.tradelog.model.Trade;
import com.tradelog.model.User;
import com.tradelog.repository.TradeRepository;
import com.tradelog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class TradeService {

    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;

    public Page<Trade> getTrades(Long userId, Trade.Segment segment, Trade.Side side,
                                  LocalDate from, LocalDate to, String symbol, Pageable pageable) {
        return tradeRepository.findFiltered(userId, segment, side, from, to, symbol, pageable);
    }

    @Transactional
    public Trade createTrade(Long userId, TradeDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Trade trade = mapToEntity(dto, user);
        trade.setGrossPnl(calculateGrossPnl(trade));
        trade.setNetPnl(trade.getGrossPnl().subtract(
                trade.getBrokerage() != null ? trade.getBrokerage() : BigDecimal.ZERO));
        return tradeRepository.save(trade);
    }

    @Transactional
    public Trade updateTrade(Long userId, Long tradeId, TradeDTO dto) {
        Trade trade = tradeRepository.findByIdAndUserId(tradeId, userId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
        updateEntity(trade, dto);
        trade.setGrossPnl(calculateGrossPnl(trade));
        trade.setNetPnl(trade.getGrossPnl().subtract(
                trade.getBrokerage() != null ? trade.getBrokerage() : BigDecimal.ZERO));
        return tradeRepository.save(trade);
    }

    @Transactional
    public void deleteTrade(Long userId, Long tradeId) {
        Trade trade = tradeRepository.findByIdAndUserId(tradeId, userId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
        tradeRepository.delete(trade);
    }

    public Trade getTradeById(Long userId, Long tradeId) {
        return tradeRepository.findByIdAndUserId(tradeId, userId)
                .orElseThrow(() -> new RuntimeException("Trade not found"));
    }

    private BigDecimal calculateGrossPnl(Trade trade) {
        BigDecimal diff = trade.getExitPrice().subtract(trade.getEntryPrice());
        if (trade.getSide() == Trade.Side.SHORT) diff = diff.negate();
        return diff.multiply(trade.getQuantity());
    }

    private Trade mapToEntity(TradeDTO dto, User user) {
        return Trade.builder()
                .user(user)
                .tradeDate(dto.getTradeDate())
                .symbol(dto.getSymbol().toUpperCase())
                .segment(dto.getSegment())
                .side(dto.getSide())
                .entryPrice(dto.getEntryPrice())
                .exitPrice(dto.getExitPrice())
                .quantity(dto.getQuantity())
                .stopLoss(dto.getStopLoss())
                .target(dto.getTarget())
                .brokerage(dto.getBrokerage() != null ? dto.getBrokerage() : BigDecimal.ZERO)
                .setup(dto.getSetup())
                .emotion(dto.getEmotion())
                .mistakeTags(dto.getMistakeTags())
                .notes(dto.getNotes())
                .source(Trade.TradeSource.MANUAL)
                .build();
    }

    private void updateEntity(Trade trade, TradeDTO dto) {
        trade.setTradeDate(dto.getTradeDate());
        trade.setSymbol(dto.getSymbol().toUpperCase());
        trade.setSegment(dto.getSegment());
        trade.setSide(dto.getSide());
        trade.setEntryPrice(dto.getEntryPrice());
        trade.setExitPrice(dto.getExitPrice());
        trade.setQuantity(dto.getQuantity());
        trade.setStopLoss(dto.getStopLoss());
        trade.setTarget(dto.getTarget());
        trade.setBrokerage(dto.getBrokerage() != null ? dto.getBrokerage() : BigDecimal.ZERO);
        trade.setSetup(dto.getSetup());
        trade.setEmotion(dto.getEmotion());
        trade.setMistakeTags(dto.getMistakeTags());
        trade.setNotes(dto.getNotes());
    }
}
