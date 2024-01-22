package com.example.Zaliczenie;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Album {
    private String id;
    private String name;
    private String artist;
    private String img;
    private String type;
    private String release;
}
