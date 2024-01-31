package com.example.smartexaminer.security;

import com.example.smartexaminer.model.dto.ResponseData;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;


import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.AccessDeniedException;

@ControllerAdvice
public class AuthEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException ex)
            throws IOException, ServletException {
        ResponseData responseData = ResponseData.builder()
                .setCode(2)
                .setMessage("Unauthorized")
                .setDescription("Invalid Token | " + ex.getMessage())
                .build();
        response.getWriter().write(new ObjectMapper().writeValueAsString(responseData));
        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
    }

    @ExceptionHandler(value = {AccessDeniedException.class})
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AccessDeniedException ex) throws IOException {
        // 403
        ResponseData responseData = ResponseData.builder()
                .setCode(1)
                .setMessage("Unauthorized")
                .setDescription("Unauthorized Access | " + ex.getMessage())
                .build();
        response.getWriter().write(new ObjectMapper().writeValueAsString(responseData));
        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
    }

    @ExceptionHandler(value = {Exception.class})
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         Exception e) throws IOException {
        // 500
        String[] msg = !StringUtils.isEmpty(e.getMessage()) ? e.getMessage().split("\\|") : new String[]{"Server Error", "An exception with no message was thrown"};
        ResponseData responseData = ResponseData.builder()
                .setCode(1)
                .setMessage(msg[0])
                .setDescription(msg.length > 1 ? msg[1] : e.getMessage())
                .build();
        response.getWriter().write(new ObjectMapper().writeValueAsString(responseData));
        response.setContentType("application/json");
        response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }

    @ExceptionHandler(value = {MethodArgumentNotValidException.class})
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         MethodArgumentNotValidException e) throws IOException {

        String msg = e.getBindingResult().getAllErrors().get(0).getDefaultMessage();
        response.getWriter().write(new ObjectMapper().writeValueAsString(new ResponseData(msg)));
        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNPROCESSABLE_ENTITY.value());
    }
}
