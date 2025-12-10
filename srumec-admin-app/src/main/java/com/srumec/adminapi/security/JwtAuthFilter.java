package com.srumec.adminapi.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Stream;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    public JwtAuthFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        // 1. Získání JWT z Cookie
        String jwtToken = Stream.of(request.getCookies() != null ? request.getCookies() : new Cookie[0])
                .filter(cookie -> "JWT_TOKEN".equals(cookie.getName()))
                .findFirst()
                .map(Cookie::getValue)
                .orElse(null);

        if (jwtToken != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                // 2. Parsuje JWT
                Map<String, Object> claims = jwtUtils.decodeJwtBody(jwtToken);
                String role = (String) claims.get("role");
                String userId = (String) claims.get("id");

                // 3. Kontrola, zda je uživatel "admin"
                if ("admin".equals(role) && userId != null) {

                    // 4. Vytvoření autority ROLE_ADMIN
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_ADMIN");

                    // 5. Autentizace uživatele
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userId,
                            null,
                            Collections.singletonList(authority)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                logger.warn("Invalid or expired JWT token received: " + e.getMessage());
                // Můžete zde odstranit neplatnou cookie: response.addCookie(createExpiredCookie("JWT_TOKEN"));
            }
        }

        filterChain.doFilter(request, response);
    }
}