package com.example.server.service;

import com.example.server.domain.dto.UserDTO;
import com.example.server.domain.dto.UserRegistrationDto;
import com.example.server.domain.dto.UserUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserDTO registerUser(UserRegistrationDto registrationDto);

    UserDTO getUserById(Long id);

    UserDTO getUserByUsername(String username);

    Page<UserDTO> getAllUsers(Pageable pageable);

    UserDTO updateUser(Long id, UserUpdateDto updateDto);

    void deleteUser(Long id);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean changePassword(Long id, String currentPassword, String newPassword);
}