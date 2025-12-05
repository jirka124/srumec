package com.srumec.adminapi.web;

import com.srumec.adminapi.domain.Alert;
import com.srumec.adminapi.domain.Event;
import com.srumec.adminapi.repo.AlertRepository;
import com.srumec.adminapi.repo.EventRepository;
import com.srumec.adminapi.service.ModerationService;
import com.srumec.adminapi.web.dto.CreateEventDTO;
import com.srumec.adminapi.web.dto.DecisionDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.text.Normalizer;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/event")
public class EventController {

    private final EventRepository repo;
    private final ModerationService moderation;
    private final AlertRepository alertRepo;

    // načteno z application.yml -> srumec.banned-words: "a,b,c"
    private final List<String> bannedWords;

    public EventController(
            EventRepository repo,
            ModerationService moderation,
            AlertRepository alertRepo,
            @Value("${srumec.banned-words:}") String bannedWordsCsv
    ) {
        this.repo = repo;
        this.moderation = moderation;
        this.alertRepo = alertRepo;
        this.bannedWords = Arrays.stream(bannedWordsCsv.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(EventController::normalize)   // uložíme už normalizované
                .collect(Collectors.toList());
    }

    // ---------- CREATE ----------
    @PostMapping(consumes = "application/json", produces = "application/json")
    public Event create(@RequestBody CreateEventDTO dto) {
        var e = new Event();
        e.setNazev(dto.nazev());
        e.setPopis(dto.popis());
        e.setLat(dto.lat());
        e.setLng(dto.lng());
        e.setUserId(dto.userId());

        e = repo.save(e); // ať máme UUID

        if (containsBannedWords(dto.nazev(), dto.popis())) {
            var alert = new Alert();
            alert.setTitle("Podezrely obsah: " + safe(dto.nazev()));
            alert.setEventId(e.getId());
            alertRepo.save(alert);
        }
        return e;
    }

    // ---------- READ ----------
    @GetMapping
    public List<Event> all() { return repo.findAll(); }

    @GetMapping("/{id}")
    public Event one(@PathVariable UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Event not found: " + id));
    }

    // ---------- DECIDE ----------
    @PostMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void decide(@PathVariable UUID id, @RequestBody DecisionDTO dto) {
        moderation.decide(id, dto);
    }

    // ---------- RESCAN (zpětně vytvoří alerty pro existující eventy) ----------
    @PostMapping("/rescan")
    @ResponseStatus(HttpStatus.OK)
    public void rescanAll() {
        var all = repo.findAll();
        for (var e : all) {
            if (containsBannedWords(e.getNazev(), e.getPopis())) {
                // pokud už existuje alert k tomuhle eventu, přeskoč (přidej si vlastní logiku)
                // jednoduchá verze: vždy přidáme nový alert
                var alert = new Alert();
                alert.setTitle("Podezrely obsah (rescan): " + safe(e.getNazev()));
                // alert.setEventId(e.getId());
                alertRepo.save(alert);
            }
        }
    }

    // ===== helpers =====
    private boolean containsBannedWords(String... parts) {
        String text = normalize(String.join(" ",
                Arrays.stream(parts).filter(Objects::nonNull).toList()));
        for (String w : bannedWords) {
            if (!w.isEmpty() && text.contains(w)) return true;
        }
        return false;
    }

    private static String normalize(String s) {
        if (s == null) return "";
        String n = Normalizer.normalize(s, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", ""); // odstraň diakritiku
        return n.toLowerCase(Locale.ROOT);
    }

    private String safe(String s) { return s == null ? "" : s; }
}
