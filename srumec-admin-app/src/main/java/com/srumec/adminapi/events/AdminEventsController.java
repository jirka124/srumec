package com.srumec.adminapi.events;

import com.srumec.adminapi.events.dto.EventDto;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/events")
public class AdminEventsController {

    private final EventsServiceClient eventsServiceClient;

    public AdminEventsController(EventsServiceClient eventsServiceClient) {
        this.eventsServiceClient = eventsServiceClient;
    }

    @GetMapping("/pending")
    public ResponseEntity<List<EventDto>> getPendingEvents(
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            HttpServletRequest request
    ) {
        String token = resolveToken(authHeader, request);
        List<EventDto> pending = eventsServiceClient.getPendingEvents(token);
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<EventDto> approveEvent(
            @PathVariable String id,
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            HttpServletRequest request
    ) {
        String token = resolveToken(authHeader, request);
        EventDto updated = eventsServiceClient.updateEventStatus(id, "approved", token);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<EventDto> rejectEvent(
            @PathVariable String id,
            @RequestHeader(name = "Authorization", required = false) String authHeader,
            HttpServletRequest request
    ) {
        String token = resolveToken(authHeader, request);
        EventDto updated = eventsServiceClient.updateEventStatus(id, "rejected", token);
        return ResponseEntity.ok(updated);
    }

    private String resolveToken(String authHeader, HttpServletRequest request) {
        // 1) zkusit Authorization: Bearer ...
        String token = extractBearerToken(authHeader);
        if (token != null) {
            return token;
        }

        // 2) pokud není header, zkusit cookie JWT_TOKEN
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if ("JWT_TOKEN".equals(c.getName())) {
                    return c.getValue();
                }
            }
        }

        // 3) jinak nic → EventsServiceClient použije defaultToken z configu
        return null;
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
