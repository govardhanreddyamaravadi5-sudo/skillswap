package com.skillswap.controller;

import com.skillswap.dto.SkillDto;
import com.skillswap.service.SkillService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkillDto>> getUserSkills(
            @PathVariable Long userId,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(skillService.getUserSkills(userId, type));
    }

    @PostMapping
    public ResponseEntity<?> addSkill(
            @RequestParam Long userId,
            @RequestBody SkillDto dto) {
        try {
            SkillDto created = skillService.addSkill(userId, dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(
            @PathVariable Long id,
            @RequestParam(required = false) Long userId) {
        try {
            skillService.deleteSkill(id, userId);
            return ResponseEntity.ok(Map.of("message", "Skill deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/explore")
    public ResponseEntity<List<SkillDto>> exploreSkills(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) Long excludeUserId) {
        return ResponseEntity.ok(skillService.exploreSkills(search, category, level, excludeUserId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSkillById(@PathVariable Long id) {
        try {
            SkillDto skill = skillService.getSkillById(id);
            return ResponseEntity.ok(skill);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
