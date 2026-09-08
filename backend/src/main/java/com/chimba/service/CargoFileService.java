package com.chimba.service;

import com.chimba.dto.CargoFileDto;
import com.chimba.model.CargoFile;
import com.chimba.model.Client;
import com.chimba.repository.CargoFileRepository;
import com.chimba.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CargoFileService {

    private final CargoFileRepository cargoFileRepository;
    private final ClientRepository clientRepository;

    public CargoFileService(CargoFileRepository cargoFileRepository, ClientRepository clientRepository) {
        this.cargoFileRepository = cargoFileRepository;
        this.clientRepository = clientRepository;
    }

    public List<CargoFileDto> filterFiles(String dateFrom, String dateTo, String fileFrom, String fileTo, String customerName) {
        LocalDate df = dateFrom != null && !dateFrom.isEmpty() ? LocalDate.parse(dateFrom) : null;
        LocalDate dt = dateTo != null && !dateTo.isEmpty() ? LocalDate.parse(dateTo) : null;
        String ff = fileFrom != null && !fileFrom.isEmpty() ? fileFrom.trim() : null;
        String ft = fileTo != null && !fileTo.isEmpty() ? fileTo.trim() : null;
        String cn = customerName != null && !customerName.isEmpty() ? customerName.trim() : null;

        List<CargoFile> files = cargoFileRepository.filterFiles(df, dt, ff, ft, cn);
        return files.stream().map(this::toDto).collect(Collectors.toList());
    }

    public CargoFileDto getFileById(Integer id) {
        CargoFile file = cargoFileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found with id: " + id));
        return toDto(file);
    }

    @Transactional
    public CargoFileDto createFile(CargoFileDto input) {
        if (input.getFileId() == null || input.getFileId().trim().isEmpty()) {
            throw new RuntimeException("File ID is required!");
        }
        if (input.getJobNumber() == null || input.getJobNumber().trim().isEmpty()) {
            throw new RuntimeException("Job Number is required!");
        }
        if (input.getClientId() == null) {
            throw new RuntimeException("Client is required!");
        }
        if (input.getFileDate() == null) {
            throw new RuntimeException("File Date is required!");
        }

        if (cargoFileRepository.existsByFileId(input.getFileId().trim())) {
            throw new RuntimeException("File ID '" + input.getFileId() + "' already exists!");
        }

        Client client = clientRepository.findById(input.getClientId())
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + input.getClientId()));

        CargoFile file = new CargoFile();
        file.setFileId(input.getFileId().trim());
        file.setJobNumber(input.getJobNumber().trim());
        file.setClient(client);
        file.setSupplierName(input.getSupplierName());
        file.setAwbBl(input.getAwbBl());
        file.setReference(input.getReference());
        file.setDescription(input.getDescription());
        file.setVessel(input.getVessel());
        file.setPlaceOfLoading(input.getPlaceOfLoading());
        file.setFileDate(input.getFileDate());

        CargoFile saved = cargoFileRepository.save(file);
        return toDto(saved);
    }

    public CargoFileDto toDto(CargoFile file) {
        CargoFileDto dto = new CargoFileDto();
        dto.setId(file.getId());
        dto.setFileId(file.getFileId());
        dto.setJobNumber(file.getJobNumber());
        if (file.getClient() != null) {
            dto.setClientId(file.getClient().getId());
            dto.setClientName(file.getClient().getName());
        }
        dto.setSupplierName(file.getSupplierName());
        dto.setAwbBl(file.getAwbBl());
        dto.setReference(file.getReference());
        dto.setDescription(file.getDescription());
        dto.setVessel(file.getVessel());
        dto.setPlaceOfLoading(file.getPlaceOfLoading());
        dto.setFileDate(file.getFileDate());
        dto.setCreatedAt(file.getCreatedAt());
        return dto;
    }
}
