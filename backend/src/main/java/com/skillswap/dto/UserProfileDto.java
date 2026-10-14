package com.skillswap.dto;

import java.util.List;

public class UserProfileDto {

    private Long id;
    private String name;
    private String email;
    private String bio;
    private String location;
    private String avatar;
    private List<SkillDto> teaches;
    private List<SkillDto> learns;

    public UserProfileDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public List<SkillDto> getTeaches() {
        return teaches;
    }

    public void setTeaches(List<SkillDto> teaches) {
        this.teaches = teaches;
    }

    public List<SkillDto> getLearns() {
        return learns;
    }

    public void setLearns(List<SkillDto> learns) {
        this.learns = learns;
    }
}
