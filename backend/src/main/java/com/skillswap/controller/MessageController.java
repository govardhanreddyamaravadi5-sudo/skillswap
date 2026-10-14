package com.skillswap.controller;

import com.skillswap.dto.MessageDto;
import com.skillswap.service.MessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(originPatterns = "*")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/history")
    public ResponseEntity<List<MessageDto>> getChatHistory(
            @RequestParam Long user1,
            @RequestParam Long user2) {
        return ResponseEntity.ok(messageService.getChatHistory(user1, user2));
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageDto dto) {
        try {
            MessageDto saved = messageService.sendMessage(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
