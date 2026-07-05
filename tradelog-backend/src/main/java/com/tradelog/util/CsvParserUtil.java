package com.tradelog.util;

import com.opencsv.CSVReader;
import com.tradelog.dto.TradeDTO;
import com.tradelog.model.Trade;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class CsvParserUtil {

    // ── Zerodha ──────────────────────────────────────────────────────
    // Columns: trade_date, tradingsymbol, trade_type, quantity, price, ...
    public List<TradeDTO> parseZerodha(java.io.InputStream is) throws Exception {
        List<TradeDTO> trades = new ArrayList<>();
        Map<String, Integer> col = Map.of(
            "trade_date", 0, "tradingsymbol", 1, "trade_type", 2,
            "quantity", 3, "price", 4
        );
        try (CSVReader reader = new CSVReader(new InputStreamReader(is))) {
            String[] headers = reader.readNext(); // skip header
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 5) continue;
                TradeDTO dto = new TradeDTO();
                dto.setTradeDate(parseDate(row[col.get("trade_date")], "yyyy-MM-dd"));
                dto.setSymbol(row[col.get("tradingsymbol")].trim().toUpperCase());
                dto.setSide("BUY".equalsIgnoreCase(row[col.get("trade_type")].trim())
                        ? Trade.Side.LONG : Trade.Side.SHORT);
                dto.setQuantity(new BigDecimal(row[col.get("quantity")].trim()));
                dto.setEntryPrice(new BigDecimal(row[col.get("price")].trim()));
                dto.setExitPrice(dto.getEntryPrice()); // single-leg; pair in post-processing
                dto.setSegment(detectSegment(dto.getSymbol()));
                trades.add(dto);
            }
        }
        return trades;
    }

    // ── Upstox ───────────────────────────────────────────────────────
    // Columns: Date, Instrument, Transaction Type, Quantity, Average Price
    public List<TradeDTO> parseUpstox(java.io.InputStream is) throws Exception {
        List<TradeDTO> trades = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(is))) {
            reader.readNext(); // skip header
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 5) continue;
                TradeDTO dto = new TradeDTO();
                dto.setTradeDate(parseDate(row[0].trim(), "dd/MM/yyyy"));
                dto.setSymbol(row[1].trim().toUpperCase());
                dto.setSide("BUY".equalsIgnoreCase(row[2].trim())
                        ? Trade.Side.LONG : Trade.Side.SHORT);
                dto.setQuantity(new BigDecimal(row[3].trim()));
                dto.setEntryPrice(new BigDecimal(row[4].trim()));
                dto.setExitPrice(dto.getEntryPrice());
                dto.setSegment(detectSegment(dto.getSymbol()));
                trades.add(dto);
            }
        }
        return trades;
    }

    // ── Angel One ────────────────────────────────────────────────────
    // Columns: Trade Date, Symbol, Buy/Sell, Quantity, Rate
    public List<TradeDTO> parseAngel(java.io.InputStream is) throws Exception {
        List<TradeDTO> trades = new ArrayList<>();
        try (CSVReader reader = new CSVReader(new InputStreamReader(is))) {
            reader.readNext();
            String[] row;
            while ((row = reader.readNext()) != null) {
                if (row.length < 5) continue;
                TradeDTO dto = new TradeDTO();
                dto.setTradeDate(parseDate(row[0].trim(), "dd-MMM-yyyy"));
                dto.setSymbol(row[1].trim().toUpperCase());
                dto.setSide("BUY".equalsIgnoreCase(row[2].trim())
                        ? Trade.Side.LONG : Trade.Side.SHORT);
                dto.setQuantity(new BigDecimal(row[3].replace(",", "").trim()));
                dto.setEntryPrice(new BigDecimal(row[4].replace(",", "").trim()));
                dto.setExitPrice(dto.getEntryPrice());
                dto.setSegment(detectSegment(dto.getSymbol()));
                trades.add(dto);
            }
        }
        return trades;
    }

    private LocalDate parseDate(String raw, String pattern) {
        return LocalDate.parse(raw, DateTimeFormatter.ofPattern(pattern));
    }

    private Trade.Segment detectSegment(String symbol) {
        if (symbol.contains("BTC") || symbol.contains("ETH") ||
            symbol.contains("USDT") || symbol.contains("BNB"))
            return Trade.Segment.CRYPTO;
        if (symbol.matches(".*\\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*FUT"))
            return Trade.Segment.FO_FUTURES;
        if (symbol.matches(".*\\d{2}(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC).*[CP]E?$"))
            return Trade.Segment.FO_OPTIONS;
        return Trade.Segment.EQUITY;
    }
}
