package com.srumec.adminapi.web.dto;

import java.util.UUID;

public record CreateEventDTO(
        String nazev,
        String popis,
        Double lat,
        Double lng,
        UUID userId
) {}
