package com.smarthealthcare.controller;

import com.smarthealthcare.entity.DoctorDetails;
import com.smarthealthcare.entity.Role;
import com.smarthealthcare.entity.User;
import com.smarthealthcare.entity.UserStatus;
import com.smarthealthcare.entity.Hospital;
import com.smarthealthcare.repository.DoctorRepository;
import com.smarthealthcare.repository.UserRepository;
import com.smarthealthcare.repository.HospitalRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final HospitalRepository hospitalRepository;

    public AdminController(UserRepository userRepository,
            DoctorRepository doctorRepository,
            HospitalRepository hospitalRepository) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @GetMapping("/pending-doctors")
    public ResponseEntity<List<User>> getPendingDoctors() {
        return ResponseEntity.ok(userRepository.findByRoleAndStatus(Role.DOCTOR, UserStatus.PENDING));
    }

    @GetMapping("/active-doctors")
    public ResponseEntity<List<User>> getActiveDoctors() {
        return ResponseEntity.ok(userRepository.findByRoleAndStatus(Role.DOCTOR, UserStatus.APPROVED));
    }

    @GetMapping("/doctor-details/{userId}")
    public ResponseEntity<DoctorDetails> getDoctorDetails(@PathVariable Long userId) {
        return ResponseEntity.ok(doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor details not found")));
    }

    @PutMapping("/approve-doctor/{userId}")
    public ResponseEntity<String> approveDoctor(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.APPROVED);
        userRepository.save(user);
        return ResponseEntity.ok("Doctor approved successfully");
    }

    @jakarta.transaction.Transactional
    @PutMapping("/reject-doctor/{userId}")
    public ResponseEntity<String> rejectDoctor(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete doctor details first due to foreign key constraint
        doctorRepository.findByUserId(userId).ifPresent(doctorRepository::delete);

        // Delete the user account
        userRepository.delete(user);

        return ResponseEntity.ok("Doctor registration rejected and deleted successfully");
    }

    @GetMapping("/blocked-doctors")
    public ResponseEntity<List<User>> getBlockedDoctors() {
        return ResponseEntity.ok(userRepository.findByRoleAndStatus(Role.DOCTOR, UserStatus.REJECTED));
    }

    @PutMapping("/block-doctor/{userId}")
    public ResponseEntity<String> blockDoctor(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.REJECTED); // Blocking sets status to REJECTED
        userRepository.save(user);
        return ResponseEntity.ok("Doctor blocked successfully");
    }

    @PutMapping("/unblock-doctor/{userId}")
    public ResponseEntity<String> unblockDoctor(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(UserStatus.APPROVED); // Unblocking sets status back to APPROVED
        userRepository.save(user);
        return ResponseEntity.ok("Doctor unblocked successfully");
    }

    @GetMapping("/hospitals")
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        return ResponseEntity.ok(hospitalRepository.findAll());
    }

    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<String> deleteHospital(@PathVariable Long id) {
        hospitalRepository.deleteById(id);
        return ResponseEntity.ok("Hospital deleted successfully");
    }
}
