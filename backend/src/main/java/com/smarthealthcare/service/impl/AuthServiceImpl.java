package com.smarthealthcare.service.impl;

import com.smarthealthcare.dto.LoginDto;
import com.smarthealthcare.dto.RegisterDto;
import com.smarthealthcare.entity.User;
import com.smarthealthcare.exception.APIException;
import com.smarthealthcare.repository.UserRepository;
import com.smarthealthcare.security.JwtTokenProvider;
import com.smarthealthcare.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private com.smarthealthcare.repository.DoctorRepository doctorRepository;
    private com.smarthealthcare.repository.HospitalRepository hospitalRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider,
            com.smarthealthcare.repository.DoctorRepository doctorRepository,
            com.smarthealthcare.repository.HospitalRepository hospitalRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.doctorRepository = doctorRepository;
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public String login(LoginDto loginDto) {
        User user = userRepository.findByEmail(loginDto.getEmail())
                .orElseThrow(() -> new APIException(HttpStatus.BAD_REQUEST,
                        "User not found with email: " + loginDto.getEmail()));

        // Status check only for doctors
        if (user.getRole() == com.smarthealthcare.entity.Role.DOCTOR) {
            if (user.getStatus() == com.smarthealthcare.entity.UserStatus.PENDING) {
                throw new APIException(HttpStatus.FORBIDDEN, "Your account is pending approval by admin.");
            }

            if (user.getStatus() == com.smarthealthcare.entity.UserStatus.REJECTED) {
                throw new APIException(HttpStatus.FORBIDDEN, "Your account registration has been rejected.");
            }
        }

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        return token;
    }

    @Override
    public String register(RegisterDto registerDto) {

        // check for email exists in database
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new APIException(HttpStatus.BAD_REQUEST, "Email is already exists!.");
        }

        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setRole(registerDto.getRole());

        // Only doctors need approval, patients and admins are auto-approved (set status
        // to null or approved)
        if (registerDto.getRole() == com.smarthealthcare.entity.Role.DOCTOR) {
            user.setStatus(com.smarthealthcare.entity.UserStatus.PENDING);
        } else {
            user.setStatus(com.smarthealthcare.entity.UserStatus.APPROVED);
        }

        userRepository.save(user);

        // If the user is registering as a DOCTOR, create a DoctorDetails entity
        if (registerDto.getRole() == com.smarthealthcare.entity.Role.DOCTOR) {
            // Validate that hospitalId and specialization are provided
            if (registerDto.getHospitalId() == null || registerDto.getSpecialization() == null
                    || registerDto.getSpecialization().isEmpty()) {
                throw new APIException(HttpStatus.BAD_REQUEST,
                        "Hospital and Specialization are required for Doctor registration.");
            }

            // Fetch the hospital
            com.smarthealthcare.entity.Hospital hospital = hospitalRepository.findById(registerDto.getHospitalId())
                    .orElseThrow(() -> new APIException(HttpStatus.BAD_REQUEST,
                            "Hospital not found with ID: " + registerDto.getHospitalId()));

            // Create DoctorDetails entity
            com.smarthealthcare.entity.DoctorDetails doctor = new com.smarthealthcare.entity.DoctorDetails();
            doctor.setName(user.getName());
            doctor.setSpecialization(registerDto.getSpecialization());
            doctor.setHospital(hospital);
            doctor.setUser(user);

            // Add new fields
            doctor.setLicenseNumber(registerDto.getLicenseNumber());
            doctor.setState(registerDto.getState());
            doctor.setDegree(registerDto.getDegree());
            doctor.setCertificatePath(registerDto.getCertificatePath());
            doctor.setVerified(false);

            doctorRepository.save(doctor);
        }

        return "User registered successfully!.";
    }
}
