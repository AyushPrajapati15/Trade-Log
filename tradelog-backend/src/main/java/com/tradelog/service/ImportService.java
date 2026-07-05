package com.tradelog.service;

import com.tradelog.dto.TradeDTO;
import com.tradelog.model.*;
import com.tradelog.repository.ImportLogRepository;
import com.tradelog.repository.TradeRepository;
import com.tradelog.repository.UserRepository;
import com.tradelog.util.CsvParserUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImportService {

    private final CsvParserUtil csvParser;
    private final TradeRepository tradeRepository;
    private final UserRepository userRepository;
    private final ImportLogRepository importLogRepository;

    @Transactional
    public Map<String, Object> importTrades(Long userId, MultipartFile file, String broker) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<TradeDTO> parsed = switch (broker.toUpperCase()) {
            case "ZERODHA" -> csvParser.parseZerodha(file.getInputStream());
            case "UPSTOX"  -> csvParser.parseUpstox(file.getInputStream());
            case "ANGEL"   -> csvParser.parseAngel(file.getInputStream());
            default -> throw new RuntimeException("Unknown broker: " + broker);
        };

        int imported = 0, skipped = 0;
        List<Trade> toSave = new ArrayList<>();
        Trade.TradeSource source = Trade.TradeSource.valueOf(broker.toUpperCase());

        for (TradeDTO dto : parsed) {
            try {
                BigDecimal diff = dto.getExitPrice().subtract(dto.getEntryPrice());
                if (dto.getSide() == Trade.Side.SHORT) diff = diff.negate();
                BigDecimal pnl = diff.multiply(dto.getQuantity());

                toSave.add(Trade.builder()
                        .user(user)
                        .tradeDate(dto.getTradeDate())
                        .symbol(dto.getSymbol())
                        .segment(dto.getSegment())
                        .side(dto.getSide())
                        .entryPrice(dto.getEntryPrice())
                        .exitPrice(dto.getExitPrice())
                        .quantity(dto.getQuantity())
                        .grossPnl(pnl)
                        .netPnl(pnl)
                        .brokerage(BigDecimal.ZERO)
                        .source(source)
                        .build());
                imported++;
            } catch (Exception e) {
                log.warn("Skipped row during import: {}", e.getMessage());
                skipped++;
            }
        }

        tradeRepository.saveAll(toSave);

        importLogRepository.save(ImportLog.builder()
                .user(user)
                .broker(ImportLog.Broker.valueOf(broker.toUpperCase()))
                .filename(file.getOriginalFilename())
                .totalRows(parsed.size())
                .imported(imported)
                .skipped(skipped)
                .build());

        return Map.of("imported", imported, "skipped", skipped, "total", parsed.size());
    }

    public List<ImportLog> getImportLogs(Long userId) {
        return importLogRepository.findByUserIdOrderByImportedAtDesc(userId);
    }
}
