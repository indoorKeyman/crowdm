package com.example.crowdm.controller.signup;

import com.example.crowdm.dto.signup.SignUpDto;
import com.example.crowdm.service.signup.SignupService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@AllArgsConstructor
public class SignupController {
    private final SignupService signupService;

    @PostMapping("/signup")
    public ResponseEntity<String> saveUser(@RequestBody SignUpDto signUpDto) {
        if (signUpDto.getId() == null || signUpDto.getId().trim().isEmpty()) {
            return new ResponseEntity<>("ID cannot be null or empty", HttpStatus.BAD_REQUEST);
        }
        if (signUpDto.getPw() == null || signUpDto.getPw().trim().isEmpty()) {
            return new ResponseEntity<>("Password cannot be null or empty", HttpStatus.BAD_REQUEST);
        }
        if (signUpDto.getEmail() == null || signUpDto.getEmail().trim().isEmpty()) {
            return new ResponseEntity<>("Email cannot be null or empty", HttpStatus.BAD_REQUEST);
        }
        try {
            signupService.saveUser(signUpDto);
            return new ResponseEntity<>("SignUp Service", HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>("An unexpected error occurred", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
