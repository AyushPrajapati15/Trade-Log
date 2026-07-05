package com.tradelog.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_tokens")
@SQLRestriction("is_deleted = false OR is_deleted IS NULL")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class OtpToken {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 150)
    private String identifier;

    @Column(name = "otp_code", nullable = false, length = 6)
    private String otpCode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OtpType type;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Builder.Default
    private Boolean used = false;

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

    public enum OtpType { EMAIL_VERIFY, MOBILE_VERIFY, LOGIN }
}
