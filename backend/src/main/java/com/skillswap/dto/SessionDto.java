package com.skillswap.dto;

public class SessionDto {

    private Long id;
    private String title;
    private Long organizerId;
    private String organizerName;   // name of the person who created the session
    private Long partnerId;         // DB id of the invited user (null if not registered)
    private String person;          // partner name for display
    private String partnerEmail;    // email used to look up the partner at creation time
    private String date;
    private String time;
    private String type;   // "Learning" or "Teaching"
    private String status; // "Upcoming", "Completed", "Cancelled"
    private String meetLink;

    public SessionDto() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getOrganizerId() { return organizerId; }
    public void setOrganizerId(Long organizerId) { this.organizerId = organizerId; }

    public String getOrganizerName() { return organizerName; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }

    public Long getPartnerId() { return partnerId; }
    public void setPartnerId(Long partnerId) { this.partnerId = partnerId; }

    public String getPerson() { return person; }
    public void setPerson(String person) { this.person = person; }

    public String getPartnerEmail() { return partnerEmail; }
    public void setPartnerEmail(String partnerEmail) { this.partnerEmail = partnerEmail; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMeetLink() { return meetLink; }
    public void setMeetLink(String meetLink) { this.meetLink = meetLink; }
}
