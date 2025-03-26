package com.example.server.controller;

import com.example.server.domain.dto.JwtResponse;
import com.example.server.domain.dto.LoginRequest;
import com.example.server.domain.dto.UserDTO;
import com.example.server.domain.dto.UserRegistrationDto;
import com.example.server.domain.entities.User;
import com.example.server.repository.UserRepository;
import com.example.server.security.JwtTokenProvider;
import com.example.server.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication and registration") // Add a tag for Swagger
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful authentication",
                    content = @Content(schema = @Schema(implementation = JwtResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized - Invalid credentials"),
            @ApiResponse(responseCode = "400", description = "Bad request - Validation errors")
    })
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        ));
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Registers a new user.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User successfully registered",
                    content = @Content(schema = @Schema(implementation = UserDTO.class))),
            @ApiResponse(responseCode = "400", description = "Bad request - Validation errors")
    })
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserRegistrationDto registrationDto) {
        return ResponseEntity.ok(userService.registerUser(registrationDto));
    }


    @PostMapping("/logout")
    @Operation(summary = "User logout", description = "Invalidates the user's JWT token.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully logged out"),
            @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<String> logout(@RequestHeader(name = "Authorization") String tokenHeader) {
        String token = tokenHeader.replace("Bearer ", "");
        jwtTokenProvider.invalidateToken(token);
        return ResponseEntity.status(HttpStatus.OK).body("Successfully logged out");
    }
}
