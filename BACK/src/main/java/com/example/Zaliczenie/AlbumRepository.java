package com.example.Zaliczenie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AlbumRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Album> getAll() {
        return jdbcTemplate.query("SELECT * FROM zaliczenie.album",
                BeanPropertyRowMapper.newInstance(Album.class));
    }

    public int save(Album album) {
        jdbcTemplate.update("INSERT INTO zaliczenie.album VALUES(?, ?, ?, ?, ?, ?)",
                album.getId(), album.getName(), album.getArtist(), album.getImg(),
                album.getType(), album.getRelease());

        return 200;
    }

    public int delete(String id) {
        return jdbcTemplate.update("DELETE FROM zaliczenie.album WHERE id=?", id);
    }
}
