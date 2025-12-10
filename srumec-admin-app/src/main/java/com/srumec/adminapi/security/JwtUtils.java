package com.srumec.adminapi.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Map;

@Component
public class JwtUtils {

    private final ObjectMapper mapper = new ObjectMapper();

    public Map<String, Object> decodeJwtBody(String token) throws Exception {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid JWT structure");
        }

        String payload = parts[1];
        // Použijeme Base64 URL dekodér, jak se typicky používá pro JWT
        byte[] decodedBytes = Base64.getUrlDecoder().decode(payload);
        String decodedString = new String(decodedBytes);

        // Převede JSON payload na Mapu
        return mapper.readValue(decodedString, Map.class);
    }
}