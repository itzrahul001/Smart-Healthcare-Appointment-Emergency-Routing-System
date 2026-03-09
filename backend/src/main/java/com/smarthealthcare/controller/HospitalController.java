package com.smarthealthcare.controller;

import com.smarthealthcare.dto.HospitalDto;
import com.smarthealthcare.service.HospitalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    private HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<HospitalDto> createHospital(@RequestBody HospitalDto hospitalDto) {
        return new ResponseEntity<>(hospitalService.createHospital(hospitalDto), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/bulk")
    public ResponseEntity<List<HospitalDto>> createHospitals(
            @RequestBody List<HospitalDto> hospitalDtos) {

        List<HospitalDto> saved = hospitalService.createHospitals(hospitalDtos);

        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<HospitalDto>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalDto> getHospitalById(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<HospitalDto> updateHospital(@PathVariable(name = "id") Long id,
            @RequestBody HospitalDto hospitalDto) {
        return ResponseEntity.ok(hospitalService.updateHospital(id, hospitalDto));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHospital(@PathVariable(name = "id") Long id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.ok("Hospital deleted successfully!.");
    }

    @GetMapping("/find-nearest")
    public ResponseEntity<List<HospitalDto>> findNearestHospitals(
            @RequestParam("lat") double lat,
            @RequestParam("lon") double lon,
            @RequestParam("radius") double radius) {
        return ResponseEntity.ok(hospitalService.findNearestHospitals(lat, lon, radius));
    }
}
