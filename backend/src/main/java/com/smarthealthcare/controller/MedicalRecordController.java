package com.smarthealthcare.controller;

import com.smarthealthcare.dto.MedicalRecordDto;
import com.smarthealthcare.service.MedicalRecordService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
public class MedicalRecordController {

    private MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @PostMapping("/upload")
    public ResponseEntity<MedicalRecordDto> uploadMedicalRecord(
            @RequestParam("patientId") Long patientId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "notes", required = false) String notes) throws IOException {

        return new ResponseEntity<>(medicalRecordService.uploadMedicalRecord(patientId, file, notes),
                HttpStatus.CREATED);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecordDto>> getMedicalRecordsByPatient(
            @PathVariable(name = "patientId") Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatient(patientId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecordDto> getMedicalRecordById(@PathVariable(name = "id") Long id) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordById(id));
    }
}
