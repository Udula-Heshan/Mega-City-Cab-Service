//DriverService
package com.megacitycab.service;

import com.megacitycab.model.Driver;
import com.megacitycab.repository.DriverRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    @Autowired
    private DriverRepository driverRepository;

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverByLicenseNumber(String licenseNumber) {
        return driverRepository.findByLicenseNumber(licenseNumber)
                .orElseThrow(() -> new RuntimeException("Driver not found with license number: " + licenseNumber));
    }

    public void deleteDriverByLicenseNumber(String licenseNumber) {
        if (!driverRepository.existsByLicenseNumber(licenseNumber)) {
            throw new RuntimeException("Driver not found with license number: " + licenseNumber);
        }
        driverRepository.deleteByLicenseNumber(licenseNumber);
    }
}
