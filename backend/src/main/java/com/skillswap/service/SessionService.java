package com.skillswap.service;

import com.skillswap.dto.SessionDto;
import com.skillswap.entity.Session;
import com.skillswap.entity.User;
import com.skillswap.repository.SessionRepository;
import com.skillswap.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionService {

    private final SessionRepository sessionRepository;
    private final UserRepository userRepository;

    public SessionService(SessionRepository sessionRepository, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    /**
     * Returns all sessions where the user is either the organizer OR the invited partner.
     * This makes sessions created by a teacher automatically appear in the learner's schedule.
     */
    public List<SessionDto> getUserSessions(Long userId) {
        return sessionRepository
                .findByOrganizerIdOrPartnerIdOrderByCreatedAtDesc(userId, userId)
                .stream()
                .map(s -> mapToDto(s, userId))
                .collect(Collectors.toList());
    }

    public SessionDto createSession(SessionDto dto) {
        User organizer = userRepository.findById(dto.getOrganizerId())
                .orElseThrow(() -> new IllegalArgumentException("Organizer not found with id: " + dto.getOrganizerId()));

        Session session = new Session();
        session.setTitle(dto.getTitle());
        session.setOrganizer(organizer);
        session.setPartnerName(dto.getPerson() != null ? dto.getPerson() : "Partner");
        session.setPartnerEmail(dto.getPartnerEmail());
        session.setSessionDate(dto.getDate());
        session.setSessionTime(dto.getTime());
        session.setSessionType(dto.getType() != null ? dto.getType() : "Learning");
        session.setStatus("Upcoming");
        session.setMeetLink(dto.getMeetLink() != null ? dto.getMeetLink() : "https://meet.google.com/new");
        session.setCreatedAt(LocalDateTime.now());

        // If a partner email is provided, try to link their account so the session
        // automatically appears in their Sessions page.
        if (dto.getPartnerEmail() != null && !dto.getPartnerEmail().isBlank()) {
            userRepository.findByEmail(dto.getPartnerEmail().trim().toLowerCase())
                    .ifPresent(session::setPartner);
        }

        Session saved = sessionRepository.save(session);
        return mapToDto(saved, dto.getOrganizerId());
    }

    public SessionDto updateSession(Long id, SessionDto dto) {
        Session session = sessionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Session not found with id: " + id));

        if (dto.getTitle() != null) session.setTitle(dto.getTitle());
        if (dto.getDate() != null) session.setSessionDate(dto.getDate());
        if (dto.getTime() != null) session.setSessionTime(dto.getTime());
        if (dto.getType() != null) session.setSessionType(dto.getType());
        if (dto.getStatus() != null) session.setStatus(dto.getStatus());
        if (dto.getMeetLink() != null) session.setMeetLink(dto.getMeetLink());

        Session saved = sessionRepository.save(session);
        return mapToDto(saved, session.getOrganizer().getId());
    }

    public void deleteSession(Long id) {
        sessionRepository.deleteById(id);
    }

    /**
     * Maps a Session to a DTO. When the requesting user is the PARTNER (not organizer),
     * the "person" field (displayed as "With X") shows the organizer's name instead.
     */
    private SessionDto mapToDto(Session session, Long requestingUserId) {
        SessionDto dto = new SessionDto();
        dto.setId(session.getId());
        dto.setTitle(session.getTitle());
        dto.setOrganizerId(session.getOrganizer().getId());
        dto.setOrganizerName(session.getOrganizer().getName());
        dto.setDate(session.getSessionDate());
        dto.setTime(session.getSessionTime());
        dto.setType(session.getSessionType());
        dto.setStatus(session.getStatus());
        dto.setMeetLink(session.getMeetLink());
        dto.setPartnerEmail(session.getPartnerEmail());

        if (session.getPartner() != null) {
            dto.setPartnerId(session.getPartner().getId());
        }

        // If the requesting user is the PARTNER, show the organizer's name as "person"
        boolean isPartnerView = session.getPartner() != null
                && session.getPartner().getId().equals(requestingUserId);

        if (isPartnerView) {
            dto.setPerson(session.getOrganizer().getName());
        } else {
            dto.setPerson(session.getPartnerName());
        }

        return dto;
    }
}
