package com.tradelog.repository;

import com.tradelog.model.Trade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TradeRepository extends JpaRepository<Trade, Long> {

    // ── Standard queries (@SQLRestriction auto-filters is_deleted=false) ──
    Page<Trade> findByUserId(Long userId, Pageable pageable);
    Page<Trade> findByUserIdAndSegment(Long userId, Trade.Segment segment, Pageable pageable);

    @Query("SELECT t FROM Trade t WHERE t.user.id = :userId " +
            "AND (:segment IS NULL OR t.segment = :segment) " +
            "AND (:side IS NULL OR t.side = :side) " +
            "AND (:from IS NULL OR t.tradeDate >= :from) " +
            "AND (:to IS NULL OR t.tradeDate <= :to) " +
            "AND (:symbol IS NULL OR LOWER(t.symbol) LIKE LOWER(CONCAT('%', :symbol, '%')))")
    Page<Trade> findFiltered(
            @Param("userId") Long userId,
            @Param("segment") Trade.Segment segment,
            @Param("side") Trade.Side side,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to,
            @Param("symbol") String symbol,
            Pageable pageable
    );

    Optional<Trade> findByIdAndUserId(Long id, Long userId);

    List<Trade> findByUserIdOrderByTradeDateDesc(Long userId);

    List<Trade> findByUserIdAndTradeDateBetween(Long userId, LocalDate from, LocalDate to);

    // Analytics queries
    @Query("SELECT COALESCE(SUM(t.netPnl), 0) FROM Trade t WHERE t.user.id = :uid AND MONTH(t.tradeDate) = :m AND YEAR(t.tradeDate) = :y")
    BigDecimal sumNetPnlByMonth(@Param("uid") Long userId, @Param("m") int month, @Param("y") int year);

    @Query("SELECT COUNT(t) FROM Trade t WHERE t.user.id = :uid AND t.grossPnl > 0 AND MONTH(t.tradeDate) = :m AND YEAR(t.tradeDate) = :y")
    long countWinsByMonth(@Param("uid") Long userId, @Param("m") int month, @Param("y") int year);

    @Query("SELECT COUNT(t) FROM Trade t WHERE t.user.id = :uid AND MONTH(t.tradeDate) = :m AND YEAR(t.tradeDate) = :y")
    long countByMonth(@Param("uid") Long userId, @Param("m") int month, @Param("y") int year);

    @Query("SELECT t.tradeDate, COALESCE(SUM(t.netPnl), 0) FROM Trade t WHERE t.user.id = :uid AND t.tradeDate BETWEEN :from AND :to GROUP BY t.tradeDate")
    List<Object[]> dailyPnlBetween(@Param("uid") Long userId, @Param("from") LocalDate from, @Param("to") LocalDate to);

    @Query("SELECT t.setup, COALESCE(SUM(t.netPnl), 0), COUNT(t) FROM Trade t WHERE t.user.id = :uid GROUP BY t.setup")
    List<Object[]> pnlBySetup(@Param("uid") Long userId);

    @Query("SELECT t.segment, COALESCE(SUM(t.netPnl), 0) FROM Trade t WHERE t.user.id = :uid GROUP BY t.segment")
    List<Object[]> pnlBySegment(@Param("uid") Long userId);

    long countByUserId(Long userId);

    @Query("SELECT COUNT(t) FROM Trade t WHERE CAST(t.createdAt AS date) = CURRENT_DATE")
    long countTodayTrades();

    // ── Soft Delete ───────────────────────────────────────────────────
    // Hard delete rows that were soft-deleted more than 7 days ago
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM trades WHERE is_deleted = TRUE AND deleted_at < :cutoff", nativeQuery = true)
    int hardDeleteSoftDeleted(@Param("cutoff") LocalDateTime cutoff);
}
