package com.smarthealthcare.service.impl;

import com.smarthealthcare.dto.HospitalDto;
import com.smarthealthcare.entity.Hospital;
import com.smarthealthcare.exception.ResourceNotFoundException;
import com.smarthealthcare.repository.HospitalRepository;
import com.smarthealthcare.service.HospitalService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HospitalServiceImpl implements HospitalService {

    private HospitalRepository hospitalRepository;
    private ModelMapper modelMapper;

    public HospitalServiceImpl(HospitalRepository hospitalRepository, ModelMapper modelMapper) {
        this.hospitalRepository = hospitalRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public HospitalDto createHospital(HospitalDto hospitalDto) {
        Hospital hospital = modelMapper.map(hospitalDto, Hospital.class);
        Hospital savedHospital = hospitalRepository.save(hospital);
        return modelMapper.map(savedHospital, HospitalDto.class);
    }

    @Override
    public HospitalDto getHospitalById(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", id));
        return modelMapper.map(hospital, HospitalDto.class);
    }

    @Override
    public List<HospitalDto> getAllHospitals() {
        List<Hospital> hospitals = hospitalRepository.findAll();
        return hospitals.stream().map((hospital) -> modelMapper.map(hospital, HospitalDto.class))
                .collect(Collectors.toList());
    }

    @Override
    public HospitalDto updateHospital(Long id, HospitalDto hospitalDto) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", id));

        hospital.setName(hospitalDto.getName());
        hospital.setLocation(hospitalDto.getLocation());
        hospital.setLatitude(hospitalDto.getLatitude());
        hospital.setLongitude(hospitalDto.getLongitude());
        hospital.setTotalBeds(hospitalDto.getTotalBeds());
        hospital.setAvailableBeds(hospitalDto.getAvailableBeds());

        Hospital updatedHospital = hospitalRepository.save(hospital);
        return modelMapper.map(updatedHospital, HospitalDto.class);
    }

    @Override
    public void deleteHospital(Long id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hospital", "id", id));
        hospitalRepository.delete(hospital);
    }

    @Override
    public List<HospitalDto> findNearestHospitals(double lat, double lon, double radius) {
        List<Hospital> hospitals = hospitalRepository.findAll();
        return hospitals.stream()
                .filter(hospital -> calculateDistance(lat, lon, hospital.getLatitude(),
                        hospital.getLongitude()) <= radius)
                .map(hospital -> modelMapper.map(hospital, HospitalDto.class))
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                        * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // convert to kilometers
    }

    @Override
    public List<HospitalDto> createHospitals(List<HospitalDto> hospitalDtos) {
        List<Hospital> hospitals = hospitalDtos.stream()
                .map(hospitalDto -> modelMapper.map(hospitalDto, Hospital.class))
                .collect(Collectors.toList());
        List<Hospital> savedHospitals = hospitalRepository.saveAll(hospitals);
        return savedHospitals.stream().map(hospital -> modelMapper.map(hospital, HospitalDto.class))
                .collect(Collectors.toList());
    }
}
