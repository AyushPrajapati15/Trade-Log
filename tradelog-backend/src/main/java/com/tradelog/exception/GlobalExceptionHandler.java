package com.tradelog.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── Runtime Exceptions ─────────────────────────────

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(
            RuntimeException ex
    ) {

        Map<String, Object> error = new HashMap<>();

        error.put("success", false);
        error.put("message", ex.getMessage());
        error.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    // ── Validation Exceptions ─────────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationException(
            MethodArgumentNotValidException ex
    ) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(FieldError::getDefaultMessage)
                .orElse("Validation failed");

        Map<String, Object> error = new HashMap<>();

        error.put("success", false);
        error.put("message", message);
        error.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }

    // ── Access Denied Exceptions ──────────────────────

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(
            AccessDeniedException ex
    ) {

        Map<String, Object> error = new HashMap<>();

        error.put("success", false);
        error.put("message", "Access denied");
        error.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(error);
    }

    // ── Generic Exceptions ────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(
            Exception ex
    ) {

        Map<String, Object> error = new HashMap<>();

        error.put("success", false);
        error.put("message", "Something went wrong");
        error.put("timestamp", LocalDateTime.now());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(error);
    }
}