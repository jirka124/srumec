package com.srumec.adminapi.service;

import com.srumec.adminapi.domain.Event;
import com.srumec.adminapi.repo.AlertRepository;
import com.srumec.adminapi.repo.EventRepository;
import com.srumec.adminapi.web.dto.DecisionDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class ModerationService {

    private static final Logger log = LoggerFactory.getLogger(ModerationService.class);

    private final EventRepository eventRepo;
    private final AlertRepository alertRepo;
    private final RestClient eventsClient;

    // base URL na srumec_events bere z env SRUMEC_EVENTS_URL (fallback localhost:8081)
    public ModerationService(EventRepository eventRepo, AlertRepository alertRepo) {
        this.eventRepo = eventRepo;
        this.alertRepo = alertRepo;
        String baseUrl = System.getenv().getOrDefault("SRUMEC_EVENTS_URL", "http://localhost:8081");
        this.eventsClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    @Transactional
    public void decide(UUID id, DecisionDTO req) {
        // 404 pokud event neexistuje
        var ev = eventRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found: " + id));

        // validace shody ID v path vs. v body (pokud FE posílá uuid)
        if (req.uuid() != null && !id.equals(req.uuid())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Path id and body uuid differ");
        }

        if (req.approved()) {
            // ✅ APPROVED → pošli do srumec_events (best-effort)
            try {
                log.info("Sending APPROVED to srumec_events for event {}", id);
                eventsClient.post()
                        .uri("/events/approved") // TODO: uprav na finální endpoint
                        .body(ev)
                        .retrieve()
                        .toBodilessEntity();
            } catch (Exception ex) {
                log.warn("Failed to send APPROVED to srumec_events: {}", ex.getMessage());
            }
            // případně zde označ event jako schválený (stav/čas) – pokud přidáš sloupec

        } else {
            // ❌ REJECTED → nejdřív pošli informaci o zamítnutí (best-effort)…
            try {
                log.info("Sending REJECTED to srumec_events for event {}", id);
                eventsClient.post()
                        .uri("/events/rejected") // TODO: uprav na finální endpoint
                        .body(ev)
                        .retrieve()
                        .toBodilessEntity();
            } catch (Exception ex) {
                log.warn("Failed to send REJECTED to srumec_events: {}", ex.getMessage());
            }

            // …pak smaž všechny alerty k eventu…
            alertRepo.deleteByEventId(id);

            // …a nakonec smaž samotný event
            eventRepo.deleteById(id);
        }
    }
}
