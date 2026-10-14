package com.skillswap.service;

import com.skillswap.dto.SwapRequestDto;
import com.skillswap.entity.SwapRequest;
import com.skillswap.entity.User;
import com.skillswap.repository.SwapRequestRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SwapRequestService {

    private final SwapRequestRepository swapRequestRepository;
    private final UserRepository userRepository;

    public SwapRequestService(SwapRequestRepository swapRequestRepository, UserRepository userRepository) {
        this.swapRequestRepository = swapRequestRepository;
        this.userRepository = userRepository;
    }

    public SwapRequestDto createRequest(SwapRequestDto dto) {
        User fromUser = userRepository.findById(dto.getFromUserId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found with id: " + dto.getFromUserId()));

        User toUser = userRepository.findById(dto.getToUserId())
                .orElseThrow(() -> new IllegalArgumentException("Recipient not found with id: " + dto.getToUserId()));

        if (fromUser.getId().equals(toUser.getId())) {
            throw new IllegalArgumentException("You cannot send a swap request to yourself.");
        }

        if (swapRequestRepository.existsByFromUserIdAndToUserIdAndSkillName(fromUser.getId(), toUser.getId(), dto.getSkillName())) {
            throw new IllegalArgumentException("You have already sent a request to this user for this skill.");
        }

        SwapRequest request = new SwapRequest();
        request.setFromUser(fromUser);
        request.setToUser(toUser);
        request.setSkillName(dto.getSkillName());
        request.setMessage(dto.getMessage() != null ? dto.getMessage() : "I would like to learn " + dto.getSkillName() + " from you.");
        request.setStatus("Pending");
        request.setCreatedAt(LocalDateTime.now());

        SwapRequest saved = swapRequestRepository.save(request);
        return mapToDto(saved);
    }

    public List<SwapRequestDto> getIncomingRequests(Long userId) {
        return swapRequestRepository.findByToUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<SwapRequestDto> getSentRequests(Long userId) {
        return swapRequestRepository.findByFromUserIdOrderByCreatedAtDesc(userId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public SwapRequestDto updateStatus(Long requestId, String status) {
        SwapRequest request = swapRequestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found with id: " + requestId));

        request.setStatus(status);
        SwapRequest saved = swapRequestRepository.save(request);
        return mapToDto(saved);
    }

    private SwapRequestDto mapToDto(SwapRequest req) {
        SwapRequestDto dto = new SwapRequestDto();
        dto.setId(req.getId());
        dto.setFromUserId(req.getFromUser().getId());
        dto.setFromUserName(req.getFromUser().getName());
        dto.setFromUserEmail(req.getFromUser().getEmail());
        dto.setToUserId(req.getToUser().getId());
        dto.setToUserName(req.getToUser().getName());
        dto.setToUserEmail(req.getToUser().getEmail());
        dto.setSkillName(req.getSkillName());
        dto.setMessage(req.getMessage());
        dto.setStatus(req.getStatus());
        dto.setCreatedAt(req.getCreatedAt());

        if (req.getCreatedAt() != null) {
            dto.setDate(req.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM dd, yyyy")));
        } else {
            dto.setDate("Recently");
        }
        return dto;
    }
}
