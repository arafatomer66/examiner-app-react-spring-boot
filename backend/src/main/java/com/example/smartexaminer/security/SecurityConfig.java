package com.example.smartexaminer.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.firewall.DefaultHttpFirewall;


@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final AuthorizationFilter authorizationFilter;

    @Value("${spring.profiles.active}")
    String profile;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.httpFirewall(new DefaultHttpFirewall());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.csrf().disable()
                .cors()
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(new AuthEntryPoint())
                .and()
                .authorizeRequests()
                .antMatchers( "/", "/login*","/login/**", "/signup*" , "/account/**").permitAll()
                .antMatchers("/api/v1/question/**", "/api/v1/exam/**", "/api/v1/drive/**",
                        "/api/v1/subscriptions/**", "/api/v1/stripe/**", "/api/v1/user-subscriptions/**").permitAll()
                .antMatchers("/logout").permitAll()
                .antMatchers("/css/**", "/images/**", "/*.js", "/*.ico").permitAll()
                .antMatchers("/v2/api-docs", "/configuration/ui", "/swagger-resources/**", "/configuration/security", "/swagger-ui/**", "/documentation/swagger-ui/index.html", "/swagger-ui/index.html", "/swagger-ui.html", "/webjars/**").permitAll()
                .anyRequest()
                .authenticated()
                .and()
                .logout()
                .logoutUrl("/logout")
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        if (profile.equalsIgnoreCase("prod")) {
            http.requiresChannel().anyRequest().requiresSecure();
        }

        http.addFilterBefore(authorizationFilter, UsernamePasswordAuthenticationFilter.class);
    }


}


