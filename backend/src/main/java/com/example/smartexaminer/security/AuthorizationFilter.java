package com.example.smartexaminer.security;

import com.example.smartexaminer.model.dto.ResponseData;
import com.example.smartexaminer.model.entity.User;
import com.example.smartexaminer.model.enums.Role;
import com.example.smartexaminer.service.UserService;
import com.example.smartexaminer.utils.JwtUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.example.smartexaminer.utils.Common.DATEFORMAT1;


@Component
public class AuthorizationFilter extends OncePerRequestFilter {


    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
        // Cookie[] cookies = request.getCookies();
        // Optional<String> optToken = Optional.ofNullable(request.getHeader(SecurityConstants.AUTH_PREFIX));
        String token = request.getHeader("Authorization");
        System.out.println("token = " + token);

        if (token == null) {
            chain.doFilter(request, response);
            return;
        }

        try {
            Optional<Claims> optClaims = jwtUtil.parseToken(token);
            if (optClaims.isPresent()) {
                Claims claims = optClaims.get();
                String email = claims.get("email", String.class);
                System.out.println("email = " + email);
                String _role = String.valueOf(claims.get("role", String.class));
                System.out.println("role = " + _role);
                Role role = Role.valueOf(_role);
                System.out.print(role.getAuthority());
                String lastLoggedIn = claims.get("lastLoggedIn", String.class);
                LocalDateTime ldt = LocalDateTime.parse(lastLoggedIn);
                List<GrantedAuthority> actualAuthority = new ArrayList<>();
                actualAuthority.add(role);
                User user = userService.getUserByUsername(email);
                System.out.println("\nDatabase date = " + user.getLastLoggedIn().getMinute());
                System.out.println("JWT date = " + ldt.getMinute());
                Boolean comparisonResult = user.getLastLoggedIn().getMinute() == ldt.getMinute() &&
                        user.getLastLoggedIn().getSecond() == ldt.getSecond() &&
                        user.getLastLoggedIn().getHour() == ldt.getHour() &&
                        user.getLastLoggedIn().getDayOfMonth() == ldt.getDayOfMonth() &&
                        user.getLastLoggedIn().getYear() == ldt.getYear();
                System.out.println("ComparisonResult = " + comparisonResult);
                if (!comparisonResult) {
                    throw new RuntimeException("Logged in|User has logged in with another device.");
                }
                CurrentUser currentUser = new CurrentUser(user.getId(), user.getUsername(), user.getPassword(), new ArrayList<>());
                SecurityContextHolder.getContext()
                        .setAuthentication(new UsernamePasswordAuthenticationToken(email, currentUser.getUid(), actualAuthority) )
                ;
                chain.doFilter(request, response);
            }
        } catch (Exception ex) {
            ResponseData responseData = ResponseData.builder()
                    .setCode(2)
                    .setMessage("Unauthorized")
                    .setDescription("Invalid Token | " + ex.getMessage())
                    .build();
            response.getWriter().write(new ObjectMapper().writeValueAsString(responseData));
            response.setContentType("application/json");
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
        }

    }

    private String getTokenFromCookies(Cookie[] cookies) {
        for (int i = 0; i < cookies.length; i++) {
            if (cookies[i].getName().equals(SecurityConstants.AUTH_PREFIX)) {
                return cookies[i].getValue();
            }
        }
        return "";
    }

}

