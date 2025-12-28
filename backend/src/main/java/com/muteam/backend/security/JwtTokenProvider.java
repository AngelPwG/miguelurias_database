package com.muteam.backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private static final String JWT_SECRET = "EstaEsUnaClaveSecretaMuyLargaYSeguraParaMuteamBackend2025Martinez";

    private static final int JWT_EXPIRATION_MS = 86400000;

    private Key getSigningKey() {
        // FORCE UTF-8 to avoid Windows CP1252 issues
        return Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Authentication authentication) {
        String username = authentication.getName();

        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + JWT_EXPIRATION_MS);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            System.out.println("DEBUG: JWT Security Signature validation failed: " + ex.getMessage());
        } catch (MalformedJwtException ex) {
            System.out.println("DEBUG: JWT Malformed: " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            System.out.println("DEBUG: JWT Expired: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.out.println("DEBUG: JWT Unsupported: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.out.println("DEBUG: JWT Claims empty/illegal: " + ex.getMessage());
        }
        return false;
    }
}