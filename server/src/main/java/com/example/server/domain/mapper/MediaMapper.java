package com.example.server.domain.mapper;

import com.example.server.domain.dto.MediaDto;
import com.example.server.domain.entities.Media;
import com.example.server.domain.mapper.UserMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring", uses = {UserMapper.class})
public interface MediaMapper {
    MediaMapper INSTANCE = Mappers.getMapper(MediaMapper.class);

    @Mapping(target = "url", ignore = true)
    MediaDto toDto(Media media);

    List<MediaDto> toDtoList(List<Media> mediaList);
}