package com.skillswap.repository;

import com.skillswap.entity.SwapRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SwapRequestRepository extends JpaRepository<SwapRequest, Long> {
    List<SwapRequest> findByToUserIdOrderByCreatedAtDesc(Long toUserId);
    List<SwapRequest> findByFromUserIdOrderByCreatedAtDesc(Long fromUserId);
    boolean existsByFromUserIdAndToUserIdAndSkillName(Long fromUserId, Long toUserId, String skillName);
}
