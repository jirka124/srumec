package com.srumec.adminapi.web;

import com.srumec.adminapi.domain.Alert;
import com.srumec.adminapi.repo.AlertRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertRepository repo;

    public AlertController(AlertRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Alert> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Alert getOne(@PathVariable UUID id) {
        return repo.findById(id).orElseThrow();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Alert create(@RequestBody Alert alert) {
        return repo.save(alert);
    }

    @PatchMapping("/{id}/status")
    public Alert updateStatus(@PathVariable UUID id, @RequestParam Alert.Status status) {
        Alert a = repo.findById(id).orElseThrow();
        a.setStatus(status);
        return repo.save(a);
    }

}
