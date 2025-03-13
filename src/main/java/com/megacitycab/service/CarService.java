//CarService
package com.megacitycab.service;

import com.megacitycab.model.Car;
import com.megacitycab.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarService {

    @Autowired
    private CarRepository carRepository;

    public Car createCar(Car car) {
        return carRepository.save(car);
    }

    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    public Car getCarByLicensePlate(String licensePlate) {
        return carRepository.findByLicensePlate(licensePlate)
                .orElseThrow(() -> new RuntimeException("Car not found with license plate: " + licensePlate));
    }

    public void deleteCarByLicensePlate(String licensePlate) {
        if (!carRepository.existsByLicensePlate(licensePlate)) {
            throw new RuntimeException("Car not found with license plate: " + licensePlate);
        }
        carRepository.deleteByLicensePlate(licensePlate);
    }

}
