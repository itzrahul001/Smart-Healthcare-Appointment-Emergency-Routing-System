package com.smarthealthcare.service;

import com.smarthealthcare.dto.MedicalRecordDto;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface MedicalRecordService {
    MedicalRecordDto uploadMedicalRecord(Long patientId, MultipartFile file, String notes) throws IOException;

    List<MedicalRecordDto> getMedicalRecordsByPatient(Long patientId);

    MedicalRecordDto getMedicalRecordById(Long id);
}
