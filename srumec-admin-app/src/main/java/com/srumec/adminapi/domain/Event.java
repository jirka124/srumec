package com.srumec.adminapi.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "event")
public class Event {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "uuid")
    private UUID id;

    private String nazev;
    private String popis;
    private Double lat;
    private Double lng;

    @Column(name = "user_id", columnDefinition = "uuid")
    private UUID userId;

    // --- get/set ---
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNazev() { return nazev; }
    public void setNazev(String nazev) { this.nazev = nazev; }

    public String getPopis() { return popis; }
    public void setPopis(String popis) { this.popis = popis; }

    public Double getLat() { return lat; }
    public void setLat(Double lat) { this.lat = lat; }

    public Double getLng() { return lng; }
    public void setLng(Double lng) { this.lng = lng; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
}
