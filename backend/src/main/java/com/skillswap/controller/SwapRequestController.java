package com.skillswap.controller;

import com.skillswap.dto.SwapRequestDto;
import com.skillswap.service.SwapRequestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class SwapRequestController {

    private final SwapRequestService swapRequestService;

    public SwapRequestController(SwapRequestService swapRequestService) {
        this.swapRequestService = swapRequestService;
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody SwapRequestDto dto) {
        try {
            SwapRequestDto created = swapRequestService.createRequest(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/incoming/{userId}")
    public ResponseEntity<List<SwapRequestDto>> getIncomingRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(swapRequestService.getIncomingRequests(userId));
    }

    @GetMapping("/sent/{userId}")
    public ResponseEntity<List<SwapRequestDto>> getSentRequests(@PathVariable Long userId) {
        return ResponseEntity.ok(swapRequestService.getSentRequests(userId));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String status = body.get("status");
            if (status == null || status.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Status is required"));
            }
            SwapRequestDto updated = swapRequestService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
