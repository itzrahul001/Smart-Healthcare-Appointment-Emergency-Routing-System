package com.smarthealthcare.service;

import com.smarthealthcare.dto.HospitalDto;
import java.util.List;

public interface HospitalService {
    HospitalDto createHospital(HospitalDto hospitalDto);

    HospitalDto getHospitalById(Long id);

    List<HospitalDto> getAllHospitals();

    HospitalDto updateHospital(Long id, HospitalDto hospitalDto);

    void deleteHospital(Long id);

    List<HospitalDto> findNearestHospitals(double lat, double lon, double radius);

    List<HospitalDto> createHospitals(List<HospitalDto> hospitalDtos);
}
