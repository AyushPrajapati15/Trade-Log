package com.tradelog.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@SQLRestriction("is_deleted = false OR is_deleted IS NULL")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(unique = true, length = 150)
    private String email;

    @Column(unique = true, length = 15)
    private String mobile;

    @Column(length = 255)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Broker broker;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private Role role = Role.USER;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 15)
    @Builder.Default
    private UserStatus status = UserStatus.UNVERIFIED;

    @Column(name = "email_verified")
    @Builder.Default
    private Boolean emailVerified = false;

    @Column(name = "mobile_verified")
    @Builder.Default
    private Boolean mobileVerified = false;

    @Column(name = "oauth_provider", length = 30)
    private String oauthProvider;

    @Column(name = "oauth_id", length = 100)
    private String oauthId;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

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

    public enum Role        { USER, ADMIN }
    public enum UserStatus  { ACTIVE, BANNED, UNVERIFIED }
    public enum Broker      { ZERODHA, UPSTOX, ANGEL, OTHER, NONE }
}
