package com.smarthealthcare.service;

import com.smarthealthcare.dto.AppointmentDto;
import com.smarthealthcare.entity.AppointmentStatus;
import java.util.List;

public interface AppointmentService {
    AppointmentDto bookAppointment(AppointmentDto appointmentDto);

    AppointmentDto getAppointmentById(Long id);

    List<AppointmentDto> getAppointmentsByPatient(Long patientId);

    List<AppointmentDto> getAppointmentsByDoctor(Long doctorId);

    List<AppointmentDto> getAppointmentsByDoctorUserId(Long userId);

    AppointmentDto cancelAppointment(Long id);

    AppointmentDto updateAppointmentStatus(Long id, AppointmentStatus status);

}
