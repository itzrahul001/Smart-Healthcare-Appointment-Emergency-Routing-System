package com.smarthealthcare.service.impl;

import com.smarthealthcare.dto.MedicalRecordDto;
import com.smarthealthcare.entity.MedicalRecord;
import com.smarthealthcare.entity.User;
import com.smarthealthcare.exception.ResourceNotFoundException;
import com.smarthealthcare.repository.MedicalRecordRepository;
import com.smarthealthcare.repository.UserRepository;
import com.smarthealthcare.service.MedicalRecordService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private MedicalRecordRepository medicalRecordRepository;
    private UserRepository userRepository;
    private CloudinaryService cloudinaryService;
    private OcrService ocrService;
    private ModelMapper modelMapper;

    public MedicalRecordServiceImpl(MedicalRecordRepository medicalRecordRepository,
            UserRepository userRepository,
            CloudinaryService cloudinaryService,
            OcrService ocrService,
            ModelMapper modelMapper) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
        this.ocrService = ocrService;
        this.modelMapper = modelMapper;
    }

    @Override
    public MedicalRecordDto uploadMedicalRecord(Long patientId, MultipartFile file, String notes) throws IOException {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", patientId));

        // Upload to Cloudinary
        String fileUrl = cloudinaryService.uploadFile(file);

        // Extract Text using OCR
        String extractedText = ocrService.extractTextFromImage(file);

        MedicalRecord medicalRecord = new MedicalRecord();
        medicalRecord.setPatient(patient);
        medicalRecord.setFileUrl(fileUrl);
        medicalRecord.setExtractedText(extractedText);
        medicalRecord.setNotes(notes);
        medicalRecord.setUploadDate(LocalDate.now());

        MedicalRecord savedRecord = medicalRecordRepository.save(medicalRecord);

        return mapToDto(savedRecord);
    }

    @Override
    public List<MedicalRecordDto> getMedicalRecordsByPatient(Long patientId) {
        List<MedicalRecord> records = medicalRecordRepository.findByPatientId(patientId);
        return records.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public MedicalRecordDto getMedicalRecordById(Long id) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MedicalRecord", "id", id));
        return mapToDto(record);
    }

    private MedicalRecordDto mapToDto(MedicalRecord record) {
        MedicalRecordDto dto = modelMapper.map(record, MedicalRecordDto.class);
        dto.setPatientId(record.getPatient().getId());
        return dto;
    }
}
