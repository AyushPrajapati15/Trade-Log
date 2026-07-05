package com.tradelog.controller;

import com.tradelog.model.ImportLog;
import com.tradelog.model.User;
import com.tradelog.service.ImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/import")
@RequiredArgsConstructor
public class ImportController {

    private final ImportService importService;

    @PostMapping("/{broker}")
    public ResponseEntity<Map<String, Object>> importCsv(
            @AuthenticationPrincipal User user,
            @PathVariable String broker,
            @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(importService.importTrades(user.getId(), file, broker));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<ImportLog>> getLogs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(importService.getImportLogs(user.getId()));
    }
}
