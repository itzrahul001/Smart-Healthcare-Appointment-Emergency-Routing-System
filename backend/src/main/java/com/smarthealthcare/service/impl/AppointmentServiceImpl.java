package com.smarthealthcare.service.impl;

import com.smarthealthcare.dto.AppointmentDto;
import com.smarthealthcare.entity.Appointment;
import com.smarthealthcare.entity.AppointmentStatus;
import com.smarthealthcare.entity.DoctorDetails;
import com.smarthealthcare.entity.User;
import com.smarthealthcare.exception.ResourceNotFoundException;
import com.smarthealthcare.repository.AppointmentRepository;
import com.smarthealthcare.repository.DoctorRepository;
import com.smarthealthcare.repository.UserRepository;
import com.smarthealthcare.service.AppointmentService;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private AppointmentRepository appointmentRepository;
    private DoctorRepository doctorRepository;
    private UserRepository userRepository;
    private ModelMapper modelMapper;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
            DoctorRepository doctorRepository,
            UserRepository userRepository,
            ModelMapper modelMapper) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public AppointmentDto bookAppointment(AppointmentDto appointmentDto) {
        log.info("Booking appointment for patient ID: {} with doctor ID: {}", appointmentDto.getPatientId(),
                appointmentDto.getDoctorId());

        try {
            DoctorDetails doctor = doctorRepository.findById(appointmentDto.getDoctorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Doctor", "id", appointmentDto.getDoctorId()));
            log.info("Found doctor: {}", doctor.getName());

            User patient = userRepository.findById(appointmentDto.getPatientId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", appointmentDto.getPatientId()));
            log.info("Found patient: {}", patient.getName());

            Appointment appointment = new Appointment();
            appointment.setDoctor(doctor);
            appointment.setPatient(patient);
            appointment.setDate(appointmentDto.getDate());
            appointment.setTime(appointmentDto.getTime());
            appointment.setStatus(AppointmentStatus.PENDING);

            log.info("Saving appointment for date: {} at time: {}", appointment.getDate(), appointment.getTime());
            Appointment savedAppointment = appointmentRepository.save(appointment);
            log.info("Appointment saved with ID: {}", savedAppointment.getId());

            return mapToDto(savedAppointment);
        } catch (Exception e) {
            log.error("Error booking appointment: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public AppointmentDto getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));
        return mapToDto(appointment);
    }

    @Override
    public List<AppointmentDto> getAppointmentsByPatient(Long patientId) {
        log.info("Fetching appointments for patient: {}", patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctor(Long doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<AppointmentDto> getAppointmentsByDoctorUserId(Long userId) {
        log.info("Fetching appointments for doctor user ID: {}", userId);
        DoctorDetails doctor = doctorRepository.findByUserId(userId)
                .orElse(null);

        if (doctor == null) {
            log.warn("No doctor found for user ID: {}", userId);
            return List.of();
        }

        return getAppointmentsByDoctor(doctor.getId());
    }

    @Override
    public AppointmentDto cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return mapToDto(updatedAppointment);
    }

    @Override
    public AppointmentDto updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment", "id", id));

        appointment.setStatus(status);
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        return mapToDto(updatedAppointment);
    }

    private AppointmentDto mapToDto(Appointment appointment) {
        AppointmentDto appointmentDto = modelMapper.map(appointment, AppointmentDto.class);
        if (appointment.getDoctor() != null) {
            appointmentDto.setDoctorId(appointment.getDoctor().getId());
            appointmentDto.setDoctorName(appointment.getDoctor().getName());
        }
        if (appointment.getPatient() != null) {
            appointmentDto.setPatientId(appointment.getPatient().getId());
            appointmentDto.setPatientName(appointment.getPatient().getName());
        }
        return appointmentDto;
    }
}
