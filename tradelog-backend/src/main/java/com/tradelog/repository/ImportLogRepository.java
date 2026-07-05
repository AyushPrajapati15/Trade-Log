package com.tradelog.repository;

import com.tradelog.model.ImportLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

public interface ImportLogRepository extends JpaRepository<ImportLog, Long> {

    List<ImportLog> findByUserIdOrderByImportedAtDesc(Long userId);
    Page<ImportLog> findAll(Pageable pageable);

    // ── Soft Delete ───────────────────────────────────────────────────
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM import_logs WHERE is_deleted = TRUE AND deleted_at < :cutoff", nativeQuery = true)
    int hardDeleteSoftDeleted(@Param("cutoff") LocalDateTime cutoff);
}
