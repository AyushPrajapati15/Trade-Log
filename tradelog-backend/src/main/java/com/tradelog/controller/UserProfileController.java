package com.tradelog.controller;

import com.tradelog.dto.*;
import com.tradelog.security.JwtUtil;
import com.tradelog.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService profileService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<UserProfileDTO> getProfile(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<String> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        profileService.updateProfile(userId, request);
        return ResponseEntity.ok("Profile updated");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChangePasswordRequest request) {
        Long userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
        profileService.changePassword(userId, request);
        return ResponseEntity.ok("Password changed");
    }
}
