# TradeLog India Backend — COMPLETE (Phase 1 + 2 + 3)

## Structure Overview

```
tradelog-backend/
├── pom.xml
├── src/main/
│   ├── java/com/tradelog/
│   │   ├── TradelogApplication.java
│   │   │
│   │   ├── model/                    [PHASE 1 - KEEP AS IS]
│   │   │   ├── User.java
│   │   │   ├── Trade.java
│   │   │   ├── OtpToken.java
│   │   │   └── ImportLog.java
│   │   │
│   │   ├── repository/               [PHASE 1 - KEEP AS IS]
│   │   │   ├── UserRepository.java
│   │   │   ├── TradeRepository.java
│   │   │   ├── OtpRepository.java
│   │   │   └── ImportLogRepository.java
│   │   │
│   │   ├── dto/
│   │   │   ├── auth/                 [PHASE 1 - KEEP AS IS]
│   │   │   │   ├── RegisterRequest.java
│   │   │   │   ├── LoginRequest.java
│   │   │   │   ├── MobileLoginRequest.java
│   │   │   │   ├── OtpRequest.java
│   │   │   │   ├── OtpVerifyRequest.java
│   │   │   │   └── AuthResponse.java
│   │   │   │
│   │   │   ├── admin/                [PHASE 1 - KEEP AS IS]
│   │   │   │   ├── AdminUserDTO.java
│   │   │   │   └── PlatformStatsDTO.java
│   │   │   │
│   │   │   ├── analytics/            [PHASE 2 - NEW FILES BELOW]
│   │   │   │   ├── AnalyticsSummaryDTO.java
│   │   │   │   ├── MonthlyPnlDTO.java
│   │   │   │   ├── SetupPerformanceDTO.java
│   │   │   │   ├── MistakeImpactDTO.java
│   │   │   │   └── CalendarDayDTO.java
│   │   │   │
│   │   │   ├── TradeDTO.java         [PHASE 1 - KEEP AS IS]
│   │   │   ├── UserProfileDTO.java   [PHASE 3 - NEW]
│   │   │   ├── UpdateProfileRequest.java  [PHASE 3 - NEW]
│   │   │   └── ChangePasswordRequest.java [PHASE 3 - NEW]
│   │   │
│   │   ├── service/
│   │   │   ├── AuthService.java      [PHASE 1 - KEEP AS IS]
│   │   │   ├── OtpService.java       [PHASE 1 - KEEP AS IS]
│   │   │   ├── EmailService.java     [PHASE 1 - KEEP AS IS]
│   │   │   ├── SmsService.java       [PHASE 1 - KEEP AS IS]
│   │   │   ├── TradeService.java     [PHASE 1 - KEEP AS IS]
│   │   │   ├── ImportService.java    [PHASE 1 - KEEP AS IS]
│   │   │   ├── admin/
│   │   │   │   └── AdminUserService.java  [PHASE 1 - KEEP AS IS]
│   │   │   ├── AnalyticsService.java [PHASE 2 - NEW]
│   │   │   └── UserProfileService.java [PHASE 3 - NEW]
│   │   │
│   │   ├── controller/
│   │   │   ├── AuthController.java   [PHASE 1 - KEEP AS IS]
│   │   │   ├── TradeController.java  [PHASE 1 - KEEP AS IS]
│   │   │   ├── ImportController.java [PHASE 1 - KEEP AS IS]
│   │   │   ├── admin/
│   │   │   │   └── AdminController.java [PHASE 1 - KEEP AS IS]
│   │   │   ├── AnalyticsController.java [PHASE 2 - NEW]
│   │   │   └── UserProfileController.java [PHASE 3 - NEW]
│   │   │
│   │   ├── security/                 [PHASE 1 - KEEP AS IS]
│   │   │   ├── JwtUtil.java
│   │   │   ├── JwtFilter.java
│   │   │   └── OAuth2SuccessHandler.java
│   │   │
│   │   ├── config/                   [PHASE 1 - KEEP AS IS]
│   │   │   ├── SecurityConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   ├── TwilioConfig.java
│   │   │   └── GlobalExceptionHandler.java
│   │   │
│   │   └── util/                     [PHASE 1 - KEEP AS IS]
│   │       ├── OtpUtil.java
│   │       └── CsvParserUtil.java
│   │
│   └── resources/
│       ├── application.yml           [PHASE 1 - KEEP AS IS]
│       └── schema.sql                [PHASE 1 - KEEP AS IS]
```

---

## ==========================================
## PHASE 1: CORE BACKEND (ALREADY INSTALLED)
## ==========================================

**KEEP ALL YOUR EXISTING PHASE 1 FILES EXACTLY AS THEY ARE:**
- All models (User, Trade, OtpToken, ImportLog)
- All repositories
- All auth DTOs and services
- All admin DTOs and services
- TradeService, ImportService
- SecurityConfig, JwtUtil, JwtFilter
- OAuth2SuccessHandler
- All controllers (Auth, Trade, Import, Admin)
- application.yml, schema.sql, pom.xml

**Total Phase 1 files: 44 files — DO NOT MODIFY**

---

## ==========================================
## PHASE 2: ANALYTICS ENDPOINTS (ADDITION)
## ==========================================

### Add these NEW files to your existing backend:

---

### File: `dto/analytics/AnalyticsSummaryDTO.java`

```java
package com.tradelog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsSummaryDTO {
    private Integer totalTrades;
    private Integer wins;
    private Integer losses;
    private Double winRate;
    private Double totalPnl;
    private Double avgWin;
    private Double avgLoss;
    private Double profitFactor;
    private Double bestTrade;
    private Double worstTrade;
}
```

---

### File: `dto/analytics/MonthlyPnlDTO.java`

```java
package com.tradelog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyPnlDTO {
    private String month; // Format: YYYY-MM
    private Double pnl;
    private Integer tradeCount;
}
```

---

### File: `dto/analytics/SetupPerformanceDTO.java`

```java
package com.tradelog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SetupPerformanceDTO {
    private String setup;
    private Integer tradeCount;
    private Double totalPnl;
    private Integer wins;
    private Double winRate;
}
```

---

### File: `dto/analytics/MistakeImpactDTO.java`

```java
package com.tradelog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MistakeImpactDTO {
    private String mistake;
    private Integer count;
    private Double totalImpact;
}
```

---

### File: `dto/analytics/CalendarDayDTO.java`

```java
package com.tradelog.dto.analytics;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CalendarDayDTO {
    private LocalDate date;
    private Double pnl;
    private Integer tradeCount;
}
```

---

### File: `service/AnalyticsService.java`

```java
package com.tradelog.service;

import com.tradelog.dto.analytics.*;
import com.tradelog.model.Trade;
import com.tradelog.repository.TradeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsService {
    private final TradeRepository tradeRepository;

    public AnalyticsSummaryDTO getSummary(Long userId) {
        List<Trade> trades = tradeRepository.findByUserIdOrderByTradeDateDesc(userId);
        
        if (trades.isEmpty()) {
            return new AnalyticsSummaryDTO(0, 0, 0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);
        }

        int wins = (int) trades.stream()
            .filter(t -> t.getNetPnl() != null && t.getNetPnl() > 0)
            .count();
        
        int losses = (int) trades.stream()
            .filter(t -> t.getNetPnl() != null && t.getNetPnl() < 0)
            .count();
        
        double winRate = trades.size() > 0 ? (wins * 100.0 / trades.size()) : 0.0;

        double totalPnl = trades.stream()
            .filter(t -> t.getNetPnl() != null)
            .mapToDouble(Trade::getNetPnl)
            .sum();

        double avgWin = trades.stream()
            .filter(t -> t.getNetPnl() != null && t.getNetPnl() > 0)
            .mapToDouble(Trade::getNetPnl)
            .average()
            .orElse(0.0);

        double avgLoss = Math.abs(trades.stream()
            .filter(t -> t.getNetPnl() != null && t.getNetPnl() < 0)
            .mapToDouble(Trade::getNetPnl)
            .average()
            .orElse(0.0));

        double profitFactor = (avgLoss > 0 && losses > 0) 
            ? (avgWin * wins) / (avgLoss * losses) 
            : 0.0;

        double bestTrade = trades.stream()
            .filter(t -> t.getNetPnl() != null)
            .mapToDouble(Trade::getNetPnl)
            .max()
            .orElse(0.0);

        double worstTrade = trades.stream()
            .filter(t -> t.getNetPnl() != null)
            .mapToDouble(Trade::getNetPnl)
            .min()
            .orElse(0.0);

        return new AnalyticsSummaryDTO(
            trades.size(),
            wins,
            losses,
            Math.round(winRate * 10) / 10.0,
            Math.round(totalPnl * 100) / 100.0,
            Math.round(avgWin * 100) / 100.0,
            Math.round(avgLoss * 100) / 100.0,
            Math.round(profitFactor * 100) / 100.0,
            Math.round(bestTrade * 100) / 100.0,
            Math.round(worstTrade * 100) / 100.0
        );
    }

    public List<MonthlyPnlDTO> getMonthlyPnl(Long userId) {
        List<Trade> trades = tradeRepository.findByUserIdOrderByTradeDateDesc(userId);
        
        Map<String, MonthlyPnlDTO> monthlyMap = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        for (Trade trade : trades) {
            String month = trade.getTradeDate().format(formatter);
            MonthlyPnlDTO dto = monthlyMap.getOrDefault(
                month, 
                new MonthlyPnlDTO(month, 0.0, 0)
            );
            
            double pnl = trade.getNetPnl() != null ? trade.getNetPnl() : 0.0;
            dto.setPnl(dto.getPnl() + pnl);
            dto.setTradeCount(dto.getTradeCount() + 1);
            monthlyMap.put(month, dto);
        }

        return monthlyMap.values().stream()
            .sorted(Comparator.comparing(MonthlyPnlDTO::getMonth))
            .collect(Collectors.toList());
    }

    public List<SetupPerformanceDTO> getSetupPerformance(Long userId) {
        List<Trade> trades = tradeRepository.findByUserIdOrderByTradeDateDesc(userId);
        
        Map<String, SetupPerformanceDTO> setupMap = new HashMap<>();

        for (Trade trade : trades) {
            String setup = trade.getSetup() != null ? trade.getSetup() : "UNKNOWN";
            SetupPerformanceDTO dto = setupMap.getOrDefault(
                setup, 
                new SetupPerformanceDTO(setup, 0, 0.0, 0, 0.0)
            );
            
            dto.setTradeCount(dto.getTradeCount() + 1);
            
            double pnl = trade.getNetPnl() != null ? trade.getNetPnl() : 0.0;
            dto.setTotalPnl(dto.getTotalPnl() + pnl);
            
            if (trade.getNetPnl() != null && trade.getNetPnl() > 0) {
                dto.setWins(dto.getWins() + 1);
            }
            
            setupMap.put(setup, dto);
        }

        // Calculate win rates
        setupMap.values().forEach(dto -> {
            double rate = dto.getTradeCount() > 0 
                ? (dto.getWins() * 100.0 / dto.getTradeCount()) 
                : 0.0;
            dto.setWinRate(Math.round(rate * 10) / 10.0);
        });

        return setupMap.values().stream()
            .sorted(Comparator.comparing(SetupPerformanceDTO::getTotalPnl).reversed())
            .collect(Collectors.toList());
    }

    public List<MistakeImpactDTO> getMistakeImpact(Long userId) {
        List<Trade> trades = tradeRepository.findByUserIdOrderByTradeDateDesc(userId);
        
        Map<String, MistakeImpactDTO> mistakeMap = new HashMap<>();

        for (Trade trade : trades) {
            if (trade.getMistakeTags() != null && !trade.getMistakeTags().isEmpty()) {
                for (String mistake : trade.getMistakeTags()) {
                    MistakeImpactDTO dto = mistakeMap.getOrDefault(
                        mistake, 
                        new MistakeImpactDTO(mistake, 0, 0.0)
                    );
                    
                    dto.setCount(dto.getCount() + 1);
                    
                    double impact = trade.getNetPnl() != null ? trade.getNetPnl() : 0.0;
                    dto.setTotalImpact(dto.getTotalImpact() + impact);
                    
                    mistakeMap.put(mistake, dto);
                }
            }
        }

        return mistakeMap.values().stream()
            .sorted(Comparator.comparing(MistakeImpactDTO::getTotalImpact))
            .collect(Collectors.toList());
    }

    public List<CalendarDayDTO> getCalendar(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.plusMonths(1);
        
        List<Trade> trades = tradeRepository.findByUserIdAndTradeDateBetween(
            userId, start, end
        );
        
        Map<LocalDate, CalendarDayDTO> calendarMap = new HashMap<>();

        for (Trade trade : trades) {
            LocalDate date = trade.getTradeDate();
            CalendarDayDTO dto = calendarMap.getOrDefault(
                date, 
                new CalendarDayDTO(date, 0.0, 0)
            );
            
            double pnl = trade.getNetPnl() != null ? trade.getNetPnl() : 0.0;
            dto.setPnl(dto.getPnl() + pnl);
            dto.setTradeCount(dto.getTradeCount() + 1);
            
            calendarMap.put(date, dto);
        }

        return calendarMap.values().stream()
            .sorted(Comparator.comparing(CalendarDayDTO::getDate))
            .collect(Collectors.toList());
    }
}
```

---

### File: `controller/AnalyticsController.java`

```java
package com.tradelog.controller;

import com.tradelog.dto.analytics.*;
import com.tradelog.security.JwtUtil;
import com.tradelog.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    private final JwtUtil jwtUtil;

    @GetMapping("/summary")
    public ResponseEntity<AnalyticsSummaryDTO> getSummary(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getSummary(userId));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<MonthlyPnlDTO>> getMonthlyPnl(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getMonthlyPnl(userId));
    }

    @GetMapping("/by-setup")
    public ResponseEntity<List<SetupPerformanceDTO>> getSetupPerformance(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getSetupPerformance(userId));
    }

    @GetMapping("/mistakes")
    public ResponseEntity<List<MistakeImpactDTO>> getMistakeImpact(
            @RequestHeader("Authorization") String authHeader) {
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(analyticsService.getMistakeImpact(userId));
    }

    @GetMapping("/calendar")
    public ResponseEntity<List<CalendarDayDTO>> getCalendar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        
        LocalDate now = LocalDate.now();
        int y = year != null ? year : now.getYear();
        int m = month != null ? month : now.getMonthValue();
        
        return ResponseEntity.ok(analyticsService.getCalendar(userId, y, m));
    }
}
```

---

### Phase 2 API Endpoints Summary

```
GET  /api/analytics/summary        → Overall stats (win rate, P&L, profit factor)
GET  /api/analytics/monthly        → Monthly P&L breakdown
GET  /api/analytics/by-setup       → Performance by setup type
GET  /api/analytics/mistakes       → Mistake impact analysis
GET  /api/analytics/calendar       → Daily P&L calendar (year, month params)
```

**Phase 2 Complete: 7 new files added ✅**

---

## ==========================================
## PHASE 3: USER PROFILE & ADDITIONAL FEATURES
## ==========================================

### Add these NEW files to your existing backend:

---

### File: `dto/UserProfileDTO.java`

```java
package com.tradelog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    private Long id;
    private String name;
    private String email;
    private String mobile;
    private String broker;
    private String role;
    private String status;
    private Boolean emailVerified;
    private Boolean mobileVerified;
    private String createdAt;
    private String lastLogin;
}
```

---

### File: `dto/UpdateProfileRequest.java`

```java
package com.tradelog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String name;
    private String broker;
}
```

---

### File: `dto/ChangePasswordRequest.java`

```java
package com.tradelog.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChangePasswordRequest {
    private String currentPassword;
    private String newPassword;
}
```

---

### File: `service/UserProfileService.java`

```java
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
                throw new RuntimeException("Invalid broker: " + request.getBroker());
            }
        }
        
        userRepository.save(user);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        // Validate new password
        if (request.getNewPassword() == null || request.getNewPassword().length() < 8) {
            throw new RuntimeException("New password must be at least 8 characters");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
```

---

### File: `controller/UserProfileController.java`

```java
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
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<String> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody UpdateProfileRequest request) {
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        profileService.updateProfile(userId, request);
        return ResponseEntity.ok("Profile updated successfully");
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ChangePasswordRequest request) {
        Long userId = jwtUtil.extractUserId(authHeader.substring(7));
        profileService.changePassword(userId, request);
        return ResponseEntity.ok("Password changed successfully");
    }
}
```

---

### Phase 3 API Endpoints Summary

```
GET  /api/profile                  → Get user profile details
PUT  /api/profile                  → Update profile (name, broker)
POST /api/profile/change-password  → Change password
```

**Phase 3 Complete: 6 new files added ✅**

---

## Summary

### Total Files by Phase

| Phase | Files | Description |
|-------|-------|-------------|
| **Phase 1** | 44 files | Core backend (auth, trades, import, admin) |
| **Phase 2** | 7 files | Analytics endpoints |
| **Phase 3** | 6 files | User profile management |
| **TOTAL** | **57 files** | Complete backend |

---

### New Endpoints Added

**Phase 2 (Analytics):**
- `GET /api/analytics/summary` — Overall performance stats
- `GET /api/analytics/monthly` — Monthly P&L
- `GET /api/analytics/by-setup` — Setup performance
- `GET /api/analytics/mistakes` — Mistake impact
- `GET /api/analytics/calendar?year=2024&month=3` — Calendar view

**Phase 3 (Profile):**
- `GET /api/profile` — View profile
- `PUT /api/profile` — Update name/broker
- `POST /api/profile/change-password` — Change password

---

### Installation Instructions

1. **Keep all Phase 1 files as-is** (44 files already created)

2. **Add Phase 2 files** (7 new files):
   - Create `dto/analytics/` folder
   - Add 5 analytics DTOs
   - Add `AnalyticsService.java`
   - Add `AnalyticsController.java`

3. **Add Phase 3 files** (6 new files):
   - Add 3 profile DTOs to `dto/`
   - Add `UserProfileService.java`
   - Add `UserProfileController.java`

4. **No changes needed to:**
   - pom.xml (already has all dependencies)
   - application.yml (no new config needed)
   - schema.sql (no new tables needed)

5. **Run:** `./mvnw spring-boot:run`

All new endpoints will be automatically available!

---

## Testing

```bash
# Analytics
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/analytics/summary
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/analytics/monthly
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/analytics/by-setup

# Profile
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/api/profile
curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"New Name","broker":"ZERODHA"}' \
  http://localhost:8080/api/profile
```

---

**Backend Phase 1+2+3 Complete! 🚀**
