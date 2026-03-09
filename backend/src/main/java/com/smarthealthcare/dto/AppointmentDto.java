package com.smarthealthcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.smarthealthcare.entity.AppointmentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDto {
    private Long id;
    private Long patientId;
    private Long doctorId;
    private String doctorName; // For display
    private String patientName; // For display
    private LocalDate date;
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;
    private AppointmentStatus status;
}
