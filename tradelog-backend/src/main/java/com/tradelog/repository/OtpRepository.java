package com.tradelog.repository;

import com.tradelog.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findTopByIdentifierAndTypeAndUsedFalseOrderByIdDesc(
            String identifier, OtpToken.OtpType type);

    @Modifying @Transactional
    @Query("UPDATE OtpToken o SET o.used = true WHERE o.identifier = :identifier AND o.type = :type")
    void invalidateAll(@Param("identifier") String identifier, @Param("type") OtpToken.OtpType type);

    // ── Soft Delete ───────────────────────────────────────────────────
    @Modifying @Transactional
    @Query(value = "DELETE FROM otp_tokens WHERE is_deleted = TRUE AND deleted_at < :cutoff", nativeQuery = true)
    int hardDeleteSoftDeleted(@Param("cutoff") LocalDateTime cutoff);

    // Hard delete expired OTPs (daily cleanup)
    @Modifying @Transactional
    @Query(value = "DELETE FROM otp_tokens WHERE expires_at < :now", nativeQuery = true)
    int hardDeleteExpired(@Param("now") LocalDateTime now);
}
