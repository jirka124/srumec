package com.srumec.adminapi.events;

import com.srumec.adminapi.events.dto.EventDto;
import com.srumec.adminapi.events.dto.UpdateEventStatusRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Component
public class EventsServiceClient {

    private final RestTemplate restTemplate;
    private final String baseUrl;
    private final String defaultToken; // náš servisní token z configu

    public EventsServiceClient(
            RestTemplate restTemplate,
            @Value("${events-service.base-url}") String baseUrl,
            @Value("${events-service.token}") String defaultToken
    ) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
        this.defaultToken = defaultToken;
    }

    /**
     * Volá POST /v1/events/get-pending
     */
    public List<EventDto> getPendingEvents(String jwtToken) {
        String url = baseUrl + "/v1/events/get-pending";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // pokud přijde token z FE, použijeme ho, jinak náš defaultní
        String tokenToUse = (jwtToken != null && !jwtToken.isBlank())
                ? jwtToken
                : defaultToken;

        if (tokenToUse != null && !tokenToUse.isBlank()) {
            headers.setBearerAuth(tokenToUse);
        }

        // curl měl -d '{}' → prázdný JSON objekt
        HttpEntity<Object> request = new HttpEntity<>(Collections.emptyMap(), headers);

        ResponseEntity<EventDto[]> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                EventDto[].class
        );

        EventDto[] body = response.getBody();
        if (body == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(body);
    }

    /**
     * Volá POST /v1/events/update-one (id + status)
     */
    public EventDto updateEventStatus(String id, String status, String jwtToken) {
        String url = baseUrl + "/v1/events/update-one";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String tokenToUse = (jwtToken != null && !jwtToken.isBlank())
                ? jwtToken
                : defaultToken;

        if (tokenToUse != null && !tokenToUse.isBlank()) {
            headers.setBearerAuth(tokenToUse);
        }

        UpdateEventStatusRequest body = new UpdateEventStatusRequest(id, status);
        HttpEntity<UpdateEventStatusRequest> request = new HttpEntity<>(body, headers);

        ResponseEntity<EventDto> response = restTemplate.exchange(
                url,
                HttpMethod.POST,
                request,
                EventDto.class
        );

        return response.getBody();
    }
}
