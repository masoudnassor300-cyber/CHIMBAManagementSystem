package com.chimba.controller;

import com.chimba.dto.CargoFileDto;
import com.chimba.service.CargoFileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
public class CargoFileController {

    private final CargoFileService cargoFileService;

    public CargoFileController(CargoFileService cargoFileService) {
        this.cargoFileService = cargoFileService;
    }

    @GetMapping
    public ResponseEntity<List<CargoFileDto>> getFiles(
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String fileFrom,
            @RequestParam(required = false) String fileTo,
            @RequestParam(required = false) String customerName
    ) {
        return ResponseEntity.ok(cargoFileService.filterFiles(dateFrom, dateTo, fileFrom, fileTo, customerName));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CargoFileDto> getFileById(@PathVariable Integer id) {
        return ResponseEntity.ok(cargoFileService.getFileById(id));
    }

    @PostMapping
    public ResponseEntity<?> createFile(@RequestBody CargoFileDto input) {
        try {
            CargoFileDto created = cargoFileService.createFile(input);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
