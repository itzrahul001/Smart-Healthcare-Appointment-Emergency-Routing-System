package com.smarthealthcare.service;

import com.smarthealthcare.dto.LoginDto;
import com.smarthealthcare.dto.RegisterDto;

public interface AuthService {
    String login(LoginDto loginDto);

    String register(RegisterDto registerDto);
}
