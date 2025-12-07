package com.srumec.adminapi.events.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class EventDto {

    private String id;

    @JsonProperty("organizer_ref")
    private String organizerRef;

    private String title;
    private String description;
    private Double latitude;
    private Double longitude;

    @JsonProperty("happen_time")
    private String happenTime; // ISO string

    private String status; // pending / approved / rejected

    // --- getters & setters ---
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getOrganizerRef() { return organizerRef; }
    public void setOrganizerRef(String organizerRef) { this.organizerRef = organizerRef; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getHappenTime() { return happenTime; }
    public void setHappenTime(String happenTime) { this.happenTime = happenTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
