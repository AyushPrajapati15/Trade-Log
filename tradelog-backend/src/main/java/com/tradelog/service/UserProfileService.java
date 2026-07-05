package com.tradelog.service;

import com.tradelog.dto.*;
import com.tradelog.model.User;
import com.tradelog.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserProfileDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        
        return new UserProfileDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getMobile(),
            user.getBroker().name(),
            user.getRole().name(),
            user.getStatus().name(),
            user.getEmailVerified(),
            user.getMobileVerified(),
            user.getCreatedAt().format(formatter),
            user.getLastLogin() != null ? user.getLastLogin().format(formatter) : null
        );
    }

    public void updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            user.setName(request.getName());
        }
        
        if (request.getBroker() != null) {
            try {
                user.setBroker(User.Broker.valueOf(request.getBroker()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid broker");
            }
        }
        
        userRepository.save(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
