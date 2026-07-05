package com.tradelog.config;

import com.tradelog.security.JwtFilter;
import com.tradelog.security.OAuth2SuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
//    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configure(http))
//            .cors(cors -> {})
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm ->
//                    sm.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))
                    sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                    .requestMatchers("/api/auth/**","/oauth2/**","/login/**").permitAll()
                .anyRequest().authenticated()
            )
//            .oauth2Login(oauth -> oauth
//                .authorizationEndpoint(e ->
//                        e.baseUri("/api/auth/oauth2/authorize"))
//                .redirectionEndpoint(e ->
//                        e.baseUri("/api/auth/oauth2/callback/*"))
//                .successHandler(oAuth2SuccessHandler)
//            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

}
