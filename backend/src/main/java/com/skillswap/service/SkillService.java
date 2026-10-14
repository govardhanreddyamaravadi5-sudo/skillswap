package com.skillswap.service;

import com.skillswap.dto.SkillDto;
import com.skillswap.entity.Skill;
import com.skillswap.entity.User;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillService(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    public List<SkillDto> getUserSkills(Long userId, String skillType) {
        List<Skill> skills;
        if (skillType != null && !skillType.isBlank()) {
            skills = skillRepository.findByUserIdAndSkillType(userId, skillType.toUpperCase());
        } else {
            skills = skillRepository.findByUserId(userId);
        }
        return skills.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public SkillDto addSkill(Long userId, SkillDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        Skill skill = new Skill();
        skill.setName(dto.getName().trim());
        skill.setCategory(dto.getCategory() != null ? dto.getCategory() : "Technology");
        skill.setLevel(dto.getLevel() != null ? dto.getLevel() : "Beginner");
        skill.setSkillType(dto.getSkillType() != null ? dto.getSkillType().toUpperCase() : "TEACH");
        skill.setUser(user);

        Skill saved = skillRepository.save(skill);
        return mapToDto(saved);
    }

    public void deleteSkill(Long skillId, Long userId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found with id: " + skillId));

        if (userId != null && !skill.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("You are not authorized to delete this skill.");
        }

        skillRepository.delete(skill);
    }

    public List<SkillDto> exploreSkills(String search, String category, String level, Long excludeUserId) {
        List<Skill> skills = skillRepository.findExploreSkills(excludeUserId);

        return skills.stream()
                .filter(s -> {
                    if (search != null && !search.isBlank()) {
                        String query = search.trim().toLowerCase();
                        boolean nameMatch = s.getName().toLowerCase().contains(query);
                        boolean userMatch = s.getUser().getName().toLowerCase().contains(query);
                        if (!nameMatch && !userMatch) return false;
                    }
                    if (category != null && !category.equalsIgnoreCase("All")) {
                        if (!s.getCategory().equalsIgnoreCase(category)) return false;
                    }
                    if (level != null && !level.equalsIgnoreCase("All")) {
                        if (!s.getLevel().equalsIgnoreCase(level)) return false;
                    }
                    return true;
                })
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public SkillDto getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Skill not found with id: " + id));
        return mapToDto(skill);
    }

    private SkillDto mapToDto(Skill skill) {
        SkillDto dto = new SkillDto();
        dto.setId(skill.getId());
        dto.setName(skill.getName());
        dto.setCategory(skill.getCategory());
        dto.setLevel(skill.getLevel());
        dto.setSkillType(skill.getSkillType());
        dto.setUserId(skill.getUser().getId());
        dto.setUserName(skill.getUser().getName());
        dto.setUserEmail(skill.getUser().getEmail());
        dto.setUserLocation(skill.getUser().getLocation());
        return dto;
    }
}
