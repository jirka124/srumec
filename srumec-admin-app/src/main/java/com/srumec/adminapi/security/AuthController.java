package com.srumec.adminapi.security;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final RestTemplate restTemplate;
    private final String externalAuthLoginUrl;

    public AuthController(
            RestTemplate restTemplate,
            @Value("${auth-service.base-url}") String authBaseUrl
    ) {
        this.restTemplate = restTemplate;
        // uvnitř docker sítě → http://auth-gateway/auth/login
        this.externalAuthLoginUrl = authBaseUrl + "/auth/login";
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        // POST na FastAPI auth přes gateway
        ResponseEntity<Map> response = restTemplate.exchange(
                externalAuthLoginUrl,
                HttpMethod.POST,
                request,
                Map.class
        );

        // přepošleme status + tělo přímo FE
        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }

    @GetMapping("/logout")
    public void logout(HttpServletResponse response) throws IOException {
        // smažeme cookie JWT_TOKEN
        Cookie cookie = new Cookie("JWT_TOKEN", "");
        cookie.setPath("/");
        cookie.setMaxAge(0);
        cookie.setHttpOnly(false);
        cookie.setSecure(false);
        response.addCookie(cookie);

        // přesměrujeme na login page
        response.sendRedirect("/login.html");
    }
}
