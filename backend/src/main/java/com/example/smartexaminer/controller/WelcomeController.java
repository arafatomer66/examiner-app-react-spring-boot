package com.example.smartexaminer.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WelcomeController {
    @GetMapping(value = "/")
    public String getHi(){
        return "bye";
    }
    @GetMapping(value = "/redirect")
    public String getRedirect(){
        return "redirect";
    }
}
