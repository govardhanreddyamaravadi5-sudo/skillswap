package com.skillswap.service;

import com.skillswap.dto.SkillDto;
import com.skillswap.dto.UserProfileDto;
import com.skillswap.entity.Skill;
import com.skillswap.entity.User;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public UserService(UserRepository userRepository, SkillRepository skillRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
    }

    public UserProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
        return mapToProfileDto(user);
    }

    public UserProfileDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));
        return mapToProfileDto(user);
    }

    public UserProfileDto updateProfile(Long userId, UserProfileDto dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        if (dto.getName() != null && !dto.getName().isBlank()) {
            user.setName(dto.getName().trim());
        }
        if (dto.getBio() != null) {
            user.setBio(dto.getBio().trim());
        }
        if (dto.getLocation() != null && !dto.getLocation().isBlank()) {
            user.setLocation(dto.getLocation().trim());
        }
        if (dto.getAvatar() != null) {
            user.setAvatar(dto.getAvatar());
        }

        User saved = userRepository.save(user);
        return mapToProfileDto(saved);
    }

    public List<UserProfileDto> getAllCommunityProfiles(Long currentUserId) {
        List<User> users = userRepository.findAll();
        return users.stream()
                .filter(u -> currentUserId == null || !u.getId().equals(currentUserId))
                .map(this::mapToProfileDto)
                .collect(Collectors.toList());
    }

    public UserProfileDto mapToProfileDto(User user) {
        UserProfileDto dto = new UserProfileDto();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setBio(user.getBio());
        dto.setLocation(user.getLocation() != null ? user.getLocation() : "India");
        dto.setAvatar(user.getAvatar());

        List<Skill> userSkills = skillRepository.findByUserId(user.getId());

        List<SkillDto> teaches = userSkills.stream()
                .filter(s -> "TEACH".equalsIgnoreCase(s.getSkillType()))
                .map(this::mapToSkillDto)
                .collect(Collectors.toList());

        List<SkillDto> learns = userSkills.stream()
                .filter(s -> "LEARN".equalsIgnoreCase(s.getSkillType()))
                .map(this::mapToSkillDto)
                .collect(Collectors.toList());

        dto.setTeaches(teaches);
        dto.setLearns(learns);
        return dto;
    }

    private SkillDto mapToSkillDto(Skill skill) {
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
