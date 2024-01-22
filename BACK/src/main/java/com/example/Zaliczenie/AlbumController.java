package com.example.Zaliczenie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AlbumController {

    @Autowired
    AlbumRepository albumRepository;

    @PostMapping("/post")
    public int postAlbum(@RequestBody Album album){
        return albumRepository.save(album);
    }

    @GetMapping("/getAll")
    public List<Album> getAll() {
        return albumRepository.getAll();
    }

    @DeleteMapping("delete/{id}")
    public int delete(@PathVariable("id") String id) {
        return albumRepository.delete(id);
    }
}
