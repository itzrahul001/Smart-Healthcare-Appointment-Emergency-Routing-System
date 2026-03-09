package com.smarthealthcare.service;

import com.smarthealthcare.dto.DoctorDto;
import java.util.List;

public interface DoctorService {
    DoctorDto createDoctor(DoctorDto doctorDto);

    DoctorDto getDoctorById(Long id);

    List<DoctorDto> getAllDoctors();

    List<DoctorDto> getDoctorsByHospital(Long hospitalId);

    DoctorDto updateDoctor(Long id, DoctorDto doctorDto);

    void deleteDoctor(Long id);
}
