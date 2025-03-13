//BookingService
package com.megacitycab.service;

import com.megacitycab.model.Booking;
import com.megacitycab.repository.BookingRepository;
import com.megacitycab.strategy.FareStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FareStrategy standardFareStrategy;
    private final FareStrategy peakHourFareStrategy;

    @Autowired
    public BookingService(
            BookingRepository bookingRepository,
            FareStrategy standardFareStrategy,
            FareStrategy peakHourFareStrategy
    ) {
        this.bookingRepository = bookingRepository;
        this.standardFareStrategy = standardFareStrategy;
        this.peakHourFareStrategy = peakHourFareStrategy;
    }

    // Add these methods
    public Booking getBookingByNumber(String bookingNumber) {
        return bookingRepository.findByBookingNumber(bookingNumber)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public double calculateBillByNumber(String bookingNumber) {
        Booking booking = getBookingByNumber(bookingNumber);
        FareStrategy strategy = booking.isPeakHour() ?
                peakHourFareStrategy : standardFareStrategy;
        return strategy.calculateFare(booking.getBaseFare(), booking.getDistanceKm());
    }

    public Booking createBooking(Booking booking) {
        booking.setBookingNumber(generateBookingNumber()); // Add this line
        booking.setPaymentStatus("PENDING"); // Set default status
        booking.setBookingDate(LocalDateTime.now()); // Add timestamp
        return bookingRepository.save(booking);
    }

    private String generateBookingNumber() {
        return "BKG-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public void deleteBookingByNumber(String bookingNumber) {
        if (!bookingRepository.existsByBookingNumber(bookingNumber)) {
            throw new RuntimeException("Booking not found with number: " + bookingNumber);
        }
        bookingRepository.deleteByBookingNumber(bookingNumber);
    }
}