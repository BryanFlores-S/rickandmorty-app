package com.rickandmorty.app.client;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class RickAndMortyClient {

    private final RestTemplate restTemplate;
    private static final String API_BASE_URL = "https://rickandmortyapi.com/api";

    public RickAndMortyClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    // Endpoint 1: Get characters with pagination and name filter
    public String getCharacters(int page, String name) {
        String url = API_BASE_URL + "/character?page=" + page;
        if (name != null && !name.isEmpty()) {
            url += "&name=" + name;
        }
        return restTemplate.getForObject(url, String.class);
    }

    // Endpoint 2: Get locations
    public String getLocations(int page) {
        String url = API_BASE_URL + "/location?page=" + page;
        return restTemplate.getForObject(url, String.class);
    }

    // Endpoint 3: Get episodes
    public String getEpisodes(int page) {
        String url = API_BASE_URL + "/episode?page=" + page;
        return restTemplate.getForObject(url, String.class);
    }
}