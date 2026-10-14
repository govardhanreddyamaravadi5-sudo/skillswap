package com.skillswap.controller;

import com.skillswap.dto.SessionDto;
import com.skillswap.service.SessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SessionDto>> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getUserSessions(userId));
    }

    @PostMapping
    public ResponseEntity<?> createSession(@RequestBody SessionDto dto) {
        try {
            SessionDto created = sessionService.createSession(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id, @RequestBody SessionDto dto) {
        try {
            SessionDto updated = sessionService.updateSession(id, dto);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        try {
            sessionService.deleteSession(id);
            return ResponseEntity.ok(Map.of("message", "Session cancelled successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
