package com.megacitycab.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Collections;
import java.util.Map;

@RestController
public class AuthController {

    @GetMapping("/api/user-role")
    public Map<String, String> getUserRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return Collections.singletonMap("role",
                auth.getAuthorities().stream()
                        .findFirst()
                        .map(GrantedAuthority::getAuthority)
                        .orElse("USER")
        );
    }
}