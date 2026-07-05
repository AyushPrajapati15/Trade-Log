package com.tradelog.service.admin;

import com.tradelog.dto.admin.AdminUserDTO;
import com.tradelog.dto.admin.PlatformStatsDTO;
import com.tradelog.model.User;
import com.tradelog.repository.TradeRepository;
import com.tradelog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;
    private final TradeRepository tradeRepository;

    public Page<AdminUserDTO> getAllUsers(String search, Pageable pageable) {
        Page<User> users = (search != null && !search.isBlank())
                ? userRepository.searchUsers(search, pageable)
                : userRepository.findAll(pageable);
        return users.map(this::toDTO);
    }

    public AdminUserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    @Transactional
    public AdminUserDTO banUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.ADMIN)
            throw new RuntimeException("Cannot ban an admin");
        user.setStatus(User.UserStatus.BANNED);
        return toDTO(userRepository.save(user));
    }

    @Transactional
    public AdminUserDTO unbanUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.UserStatus.ACTIVE);
        return toDTO(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() == User.Role.ADMIN)
            throw new RuntimeException("Cannot delete an admin account");
        userRepository.delete(user);
    }

    public PlatformStatsDTO getPlatformStats() {
        return PlatformStatsDTO.builder()
                .totalUsers(userRepository.count())
                .activeUsers(userRepository.countByStatus(User.UserStatus.ACTIVE))
                .bannedUsers(userRepository.countByStatus(User.UserStatus.BANNED))
                .unverifiedUsers(userRepository.countByStatus(User.UserStatus.UNVERIFIED))
                .totalTrades(tradeRepository.count())
                .todayTrades(tradeRepository.countTodayTrades())
                .build();
    }

    private AdminUserDTO toDTO(User u) {
        return AdminUserDTO.builder()
                .id(u.getId())
                .name(u.getName())
                .email(u.getEmail())
                .mobile(u.getMobile())
                .role(u.getRole())
                .status(u.getStatus())
                .broker(u.getBroker())
                .emailVerified(u.getEmailVerified())
                .mobileVerified(u.getMobileVerified())
                .createdAt(u.getCreatedAt())
                .lastLogin(u.getLastLogin())
                .tradeCount(tradeRepository.countByUserId(u.getId()))
                .build();
    }
}
