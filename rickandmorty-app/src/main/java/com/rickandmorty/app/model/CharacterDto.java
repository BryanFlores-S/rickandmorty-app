package com.rickandmorty.app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CharacterDto {
    private Long id;
    private String name;
    private String status;
    private String species;
    private String gender;
    private String image;
    private OriginDto origin;
    private LocationDto location;
    private List<String> episode;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OriginDto {
        private String name;
        private String url;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class LocationDto {
        private String name;
        private String url;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public OriginDto getOrigin() { return origin; }
    public void setOrigin(OriginDto origin) { this.origin = origin; }

    public LocationDto getLocation() { return location; }
    public void getLocation(LocationDto location) { this.location = location; }

    public List<String> getEpisode() { return episode; }
    public void setEpisode(List<String> episode) { this.episode = episode; }
}