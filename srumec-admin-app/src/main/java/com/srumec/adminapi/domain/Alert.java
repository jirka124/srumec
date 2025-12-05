package com.srumec.adminapi.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "alert")
public class Alert {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    private String title;

    @Enumerated(EnumType.STRING)
    private Status status = Status.NEW;

    @Column(name = "event_id", columnDefinition = "uuid")
    private UUID eventId;               // ← přidáno

    private Instant createdAt = Instant.now();

    public enum Status { NEW, IN_PROGRESS, RESOLVED }

    // getters/setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public UUID getEventId() { return eventId; }          // ← přidáno
    public void setEventId(UUID eventId) { this.eventId = eventId; } // ← přidáno

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
