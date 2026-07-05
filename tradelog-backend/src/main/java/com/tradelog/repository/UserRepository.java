package com.tradelog.repository;

import com.tradelog.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByMobile(String mobile);
    Optional<User> findByOauthProviderAndOauthId(String provider, String oauthId);
    boolean existsByEmail(String email);
    boolean existsByMobile(String mobile);

    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "u.mobile LIKE CONCAT('%', :search, '%')")
    Page<User> searchUsers(@Param("search") String search, Pageable pageable);

    long countByStatus(User.UserStatus status);

    // ── Soft Delete ───────────────────────────────────────────────────
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM users WHERE is_deleted = TRUE AND deleted_at < :cutoff", nativeQuery = true)
    int hardDeleteSoftDeleted(@Param("cutoff") LocalDateTime cutoff);
}
