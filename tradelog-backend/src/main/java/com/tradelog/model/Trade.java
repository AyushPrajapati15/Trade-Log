package com.tradelog.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "trades")
@SQLRestriction("is_deleted = false OR is_deleted IS NULL")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Trade {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "trade_date", nullable = false)
    private LocalDate tradeDate;

    @Column(nullable = false, length = 50)
    private String symbol;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    private Segment segment;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Side side;

    @Column(name = "entry_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal entryPrice;

    @Column(name = "exit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal exitPrice;

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal quantity;

    @Column(name = "stop_loss", precision = 12, scale = 2)
    private BigDecimal stopLoss;

    @Column(name = "target", precision = 12, scale = 2)
    private BigDecimal target;

    @Column(name = "gross_pnl", precision = 12, scale = 2)
    private BigDecimal grossPnl;

    @Column(name = "net_pnl", precision = 12, scale = 2)
    private BigDecimal netPnl;

    @Column(precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal brokerage = BigDecimal.ZERO;

    @Column(length = 50)
    private String setup;

    @Column(length = 30)
    private String emotion;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "mistake_tags", columnDefinition = "json")
    private List<String> mistakeTags;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    @Builder.Default
    private TradeSource source = TradeSource.MANUAL;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── Soft Delete ──────────────────────────────────────
    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public void softDelete() {
        this.isDeleted = true;
        this.deletedAt = LocalDateTime.now();
    }

    public enum Segment     { EQUITY, FO_OPTIONS, FO_FUTURES, CRYPTO }
    public enum Side        { LONG, SHORT }
    public enum TradeSource { MANUAL, ZERODHA, UPSTOX, ANGEL }
}
