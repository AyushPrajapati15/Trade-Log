package com.tradelog.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "import_logs")
@SQLRestriction("is_deleted = false OR is_deleted IS NULL")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ImportLog {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Broker broker;

    @Column(length = 200)
    private String filename;

    private Integer totalRows;
    private Integer imported;
    private Integer skipped;

    @Column(name = "imported_at")
    @Builder.Default
    private LocalDateTime importedAt = LocalDateTime.now();

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

    public enum Broker { ZERODHA, UPSTOX, ANGEL }
}
