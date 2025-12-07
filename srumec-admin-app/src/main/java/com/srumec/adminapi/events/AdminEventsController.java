package com.srumec.adminapi.events; // uprav package

import com.srumec.adminapi.events.dto.EventDto;
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
            @RequestHeader(name = "Authorization", required = false) String authHeader
    ) {
        String token = extractBearerToken(authHeader);
        List<EventDto> pending = eventsServiceClient.getPendingEvents(token);
        return ResponseEntity.ok(pending);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<EventDto> approveEvent(
            @PathVariable String id,
            @RequestHeader(name = "Authorization", required = false) String authHeader
    ) {
        String token = extractBearerToken(authHeader);
        EventDto updated = eventsServiceClient.updateEventStatus(id, "approved", token);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<EventDto> rejectEvent(
            @PathVariable String id,
            @RequestHeader(name = "Authorization", required = false) String authHeader
    ) {
        String token = extractBearerToken(authHeader);
        EventDto updated = eventsServiceClient.updateEventStatus(id, "rejected", token);
        return ResponseEntity.ok(updated);
    }

    private String extractBearerToken(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }
}
