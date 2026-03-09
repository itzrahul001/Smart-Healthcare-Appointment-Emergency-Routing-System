package com.smarthealthcare.repository;

import com.smarthealthcare.entity.DoctorDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorRepository extends JpaRepository<DoctorDetails, Long> {
    List<DoctorDetails> findByHospitalId(Long hospitalId);

    List<DoctorDetails> findBySpecializationContaining(String specialization);

    List<DoctorDetails> findByUserStatus(com.smarthealthcare.entity.UserStatus status);

    java.util.Optional<DoctorDetails> findByUserId(Long userId);
}
