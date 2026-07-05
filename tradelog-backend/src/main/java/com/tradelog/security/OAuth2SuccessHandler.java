package com.tradelog.security;

import com.tradelog.model.User;
import com.tradelog.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();
        String email = oauthUser.getAttribute("email");
        String name  = oauthUser.getAttribute("name");
        String sub   = oauthUser.getAttribute("sub");

        User user = userRepository.findByOauthProviderAndOauthId("google", sub)
                .orElseGet(() -> userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .name(name)
                        .email(email)
                        .oauthProvider("google")
                        .oauthId(sub)
                        .emailVerified(true)
                        .mobileVerified(false)
                        .status(User.UserStatus.ACTIVE)
                        .role(User.Role.USER)
                        .build())));

        // Update oauth fields if user already existed without them
        if (user.getOauthId() == null) {
            user.setOauthProvider("google");
            user.setOauthId(sub);
            user.setEmailVerified(true);
            if (user.getStatus() == User.UserStatus.UNVERIFIED)
                user.setStatus(User.UserStatus.ACTIVE);
            userRepository.save(user);
        }

        String accessToken  = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        response.sendRedirect(frontendUrl + "/oauth-callback?token=" + accessToken + "&refresh=" + refreshToken);
    }
}
