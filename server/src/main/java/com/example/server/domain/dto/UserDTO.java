package com.example.server.domain.dto;

import com.example.server.domain.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String profileImage;
    private UserRole role;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}