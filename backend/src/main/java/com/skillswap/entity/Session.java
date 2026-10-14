package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "organizer_id", nullable = false)
    private User organizer;

    // The invited participant (learner or teacher on the other side).
    // Resolved by email at session-creation time; may be null if partner is not yet registered.
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "partner_id")
    private User partner;

    @Column(name = "partner_name", nullable = false)
    private String partnerName;

    @Column(name = "partner_email")
    private String partnerEmail;

    @Column(name = "session_date", nullable = false)
    private String sessionDate;

    @Column(name = "session_time", nullable = false)
    private String sessionTime;

    // "Learning" or "Teaching"
    @Column(name = "session_type", nullable = false)
    private String sessionType;

    // "Upcoming", "Completed", "Cancelled"
    @Column(nullable = false)
    private String status;

    @Column(name = "meet_link")
    private String meetLink;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Session() {
    }

    public Session(String title, User organizer, String partnerName, String partnerEmail,
                   String sessionDate, String sessionTime, String sessionType, String meetLink) {
        this.title = title;
        this.organizer = organizer;
        this.partnerName = partnerName;
        this.partnerEmail = partnerEmail;
        this.sessionDate = sessionDate;
        this.sessionTime = sessionTime;
        this.sessionType = sessionType;
        this.meetLink = meetLink;
        this.status = "Upcoming";
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "Upcoming";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public User getOrganizer() {
        return organizer;
    }

    public void setOrganizer(User organizer) {
        this.organizer = organizer;
    }

    public User getPartner() {
        return partner;
    }

    public void setPartner(User partner) {
        this.partner = partner;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public String getPartnerEmail() {
        return partnerEmail;
    }

    public void setPartnerEmail(String partnerEmail) {
        this.partnerEmail = partnerEmail;
    }

    public String getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(String sessionDate) {
        this.sessionDate = sessionDate;
    }

    public String getSessionTime() {
        return sessionTime;
    }

    public void setSessionTime(String sessionTime) {
        this.sessionTime = sessionTime;
    }

    public String getSessionType() {
        return sessionType;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMeetLink() {
        return meetLink;
    }

    public void setMeetLink(String meetLink) {
        this.meetLink = meetLink;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
