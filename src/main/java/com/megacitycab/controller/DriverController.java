//DriverController
package com.megacitycab.controller;

import com.megacitycab.model.Driver;
import com.megacitycab.service.DriverService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin
public class DriverController {

    @Autowired
    private DriverService driverService;

    @PostMapping
    public Driver createDriver(@RequestBody Driver driver) {
        return driverService.createDriver(driver);
    }

    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    @GetMapping("/{licenseNumber}")
    public Driver getDriverByLicenseNumber(@PathVariable String licenseNumber) {
        return driverService.getDriverByLicenseNumber(licenseNumber);
    }

    @DeleteMapping("/{licenseNumber}")
    public void deleteDriverByLicenseNumber(@PathVariable String licenseNumber) {
        driverService.deleteDriverByLicenseNumber(licenseNumber);
    }
}