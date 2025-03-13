// CarController.java
package com.megacitycab.controller;

import com.megacitycab.model.Car;
import com.megacitycab.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin
public class CarController {

    @Autowired
    private CarService carService;

    @PostMapping
    public Car createCar(@RequestBody Car car) {
        return carService.createCar(car);
    }

    @GetMapping
    public List<Car> getAllCars() {
        return carService.getAllCars();
    }

    @GetMapping("/{licensePlate}")
    public Car getCarByLicensePlate(@PathVariable String licensePlate) {
        return carService.getCarByLicensePlate(licensePlate);
    }

    @DeleteMapping("/{licensePlate}")
    public void deleteCarByLicensePlate(@PathVariable String licensePlate) {
        carService.deleteCarByLicensePlate(licensePlate);
    }
}