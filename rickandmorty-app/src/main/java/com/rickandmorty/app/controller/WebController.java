package com.rickandmorty.app.controller;

import com.rickandmorty.app.client.RickAndMortyClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rickandmorty")
public class WebController {

    private final RickAndMortyClient rickAndMortyClient;

    public WebController(RickAndMortyClient rickAndMortyClient) {
        this.rickAndMortyClient = rickAndMortyClient;
    }

    // Proxy endpoint for characters
    @GetMapping("/characters")
    public ResponseEntity<String> getCharacters(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(required = false) String name) {
        String response = rickAndMortyClient.getCharacters(page, name);
        return ResponseEntity.ok(response);
    }

    // Proxy endpoint for locations
    @GetMapping("/locations")
    public ResponseEntity<String> getLocations(@RequestParam(defaultValue = "1") int page) {
        String response = rickAndMortyClient.getLocations(page);
        return ResponseEntity.ok(response);
    }

    // Proxy endpoint for episodes
    @GetMapping("/episodes")
    public ResponseEntity<String> getEpisodes(@RequestParam(defaultValue = "1") int page) {
        String response = rickAndMortyClient.getEpisodes(page);
        return ResponseEntity.ok(response);
    }
}