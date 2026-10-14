package com.skillswap.repository;

import com.skillswap.entity.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

    List<Session> findByOrganizerIdOrderByCreatedAtDesc(Long organizerId);

    List<Session> findByPartnerIdOrderByCreatedAtDesc(Long partnerId);

    // Returns all sessions where the user is either the organizer OR the invited partner
    List<Session> findByOrganizerIdOrPartnerIdOrderByCreatedAtDesc(Long organizerId, Long partnerId);
}
