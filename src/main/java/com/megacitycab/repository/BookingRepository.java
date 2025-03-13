
//BookingRepository
package com.megacitycab.repository;

import com.megacitycab.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BookingRepository extends MongoRepository<Booking, String> {
    Optional<Booking> findByBookingNumber(String bookingNumber);
    boolean existsByBookingNumber(String bookingNumber);
    void deleteByBookingNumber(String bookingNumber);
}