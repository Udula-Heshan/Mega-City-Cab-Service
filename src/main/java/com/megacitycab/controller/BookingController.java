

package com.megacitycab.controller;

import com.megacitycab.model.Booking;
import com.megacitycab.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{bookingNumber}")
    public Booking getBooking(@PathVariable String bookingNumber) {
        return bookingService.getBookingByNumber(bookingNumber);
    }

    @GetMapping("/{bookingNumber}/bill")
    public Map<String, Double> calculateBill(@PathVariable String bookingNumber) {
        return Collections.singletonMap("total",
                bookingService.calculateBillByNumber(bookingNumber));
    }

    @DeleteMapping("/{bookingNumber}")
    public void deleteBooking(@PathVariable String bookingNumber) {
        bookingService.deleteBookingByNumber(bookingNumber);
    }
}