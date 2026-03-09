package com.smarthealthcare.dto;

import com.smarthealthcare.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDto {
    private String name;
    private String email;
    private String password;
    private Role role;
    private Long hospitalId; // Optional: Required only for DOCTOR role
    private String specialization; // Optional: Required only for DOCTOR role

    // New fields for Doctor Details
    private String licenseNumber;
    private String state;
    private String degree;
    private String certificatePath;
}
