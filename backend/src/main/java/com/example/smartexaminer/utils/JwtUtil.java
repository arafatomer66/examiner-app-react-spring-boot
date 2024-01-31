package com.example.smartexaminer.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;


import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Component
public class JwtUtil implements Serializable {

       public String generateToken(Map<String,Object> tokenData) {
        return Jwts.builder().setClaims(tokenData)
//            .setExpiration(new Date(System.currentTimeMillis() + SecurityConstants.EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, Common.API_KEY)
                .compact();
    }


    public String generateConfirmationToken(String email){
        Map<String,Object> tok = new HashMap<>();
        tok.put("email",email);
        tok.put("subject","email_confirmation");
        return Jwts.builder().setClaims(tok).signWith(SignatureAlgorithm.HS512,Common.API_KEY)
                .compact();
    }

    public String generateChangePassToken(String email){
        Map<String,Object> tok = new HashMap<>();
        tok.put("email",email);
        tok.put("subject","change_pass");
        return Jwts.builder().setClaims(tok).signWith(SignatureAlgorithm.HS512,Common.API_KEY)
                .compact();
    }

    public Optional<Claims> parseToken(String token) {
        return Optional.ofNullable(Jwts.parser()
                .setSigningKey(Common.API_KEY)
                .parseClaimsJws(token)
                .getBody());
    }


}
