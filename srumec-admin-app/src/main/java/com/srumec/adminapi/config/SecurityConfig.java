package com.srumec.adminapi.config;

import com.srumec.adminapi.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // Povolíme statické soubory a login bez autentizace
                        .requestMatchers("/login.html", "/auth/**", "/css/**", "/js/**", "/images/**").permitAll()

                        // Požadujeme ROLE_ADMIN pro index.html a kořenovou cestu
                        .requestMatchers("/", "/index.html").hasRole("ADMIN")
                        .anyRequest().authenticated() // Vše ostatní vyžaduje alespoň autentizaci
                )

                // Stateless konfigurace pro JWT
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // Konfigurace, kam se má přesměrovat nepřihlášený uživatel
                .formLogin(form -> form
                        .loginPage("/login.html")
                        .permitAll()
                )

                // Přidáme náš JWT filtr PŘED Spring Security
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}