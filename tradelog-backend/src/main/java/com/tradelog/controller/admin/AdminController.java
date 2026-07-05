package com.tradelog.controller.admin;

import com.tradelog.dto.admin.AdminUserDTO;
import com.tradelog.dto.admin.PlatformStatsDTO;
import com.tradelog.model.Trade;
import com.tradelog.repository.TradeRepository;
import com.tradelog.service.admin.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminUserService adminUserService;
    private final TradeRepository tradeRepository;

    @GetMapping("/stats")
    public ResponseEntity<PlatformStatsDTO> getStats() {
        return ResponseEntity.ok(adminUserService.getPlatformStats());
    }

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserDTO>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search) {
        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(adminUserService.getAllUsers(search, pr));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @GetMapping("/users/{id}/trades")
    public ResponseEntity<Page<Trade>> getUserTrades(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "tradeDate"));
        return ResponseEntity.ok(tradeRepository.findByUserId(id, pr));
    }

    @PutMapping("/users/{id}/ban")
    public ResponseEntity<AdminUserDTO> banUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.banUser(id));
    }

    @PutMapping("/users/{id}/unban")
    public ResponseEntity<AdminUserDTO> unbanUser(@PathVariable Long id) {
        return ResponseEntity.ok(adminUserService.unbanUser(id));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminUserService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
}
