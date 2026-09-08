package com.chimba.service;

import com.chimba.dto.ClientDto;
import com.chimba.model.Client;
import com.chimba.repository.CargoFileRepository;
import com.chimba.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientService {

    private final ClientRepository clientRepository;
    private final CargoFileRepository cargoFileRepository;

    public ClientService(ClientRepository clientRepository, CargoFileRepository cargoFileRepository) {
        this.clientRepository = clientRepository;
        this.cargoFileRepository = cargoFileRepository;
    }

    public List<ClientDto> getAllClients(String search) {
        List<Client> clients;
        if (search != null && !search.trim().isEmpty()) {
            clients = clientRepository.searchClients(search.trim());
        } else {
            clients = clientRepository.findAllByOrderByCreatedAtDesc();
        }

        return clients.stream().map(this::toDto).collect(Collectors.toList());
    }

    public ClientDto getClientById(Integer id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Client not found with id: " + id));
        return toDto(client);
    }

    @Transactional
    public ClientDto createClient(Client client) {
        if (client.getClientId() == null || client.getClientId().trim().isEmpty()) {
            throw new RuntimeException("Client ID is required!");
        }
        if (client.getName() == null || client.getName().trim().isEmpty()) {
            throw new RuntimeException("Client Name is required!");
        }

        if (clientRepository.existsByClientId(client.getClientId().trim())) {
            throw new RuntimeException("Client ID '" + client.getClientId() + "' already exists!");
        }

        client.setClientId(client.getClientId().trim());
        client.setName(client.getName().trim());
        if (client.getAddress() != null) client.setAddress(client.getAddress().trim());
        if (client.getCity() != null) client.setCity(client.getCity().trim());
        if (client.getEmail() != null) client.setEmail(client.getEmail().trim());
        if (client.getTin() != null) client.setTin(client.getTin().trim());

        Client saved = clientRepository.save(client);
        return toDto(saved);
    }

    private ClientDto toDto(Client client) {
        ClientDto dto = new ClientDto();
        dto.setId(client.getId());
        dto.setClientId(client.getClientId());
        dto.setName(client.getName());
        dto.setAddress(client.getAddress());
        dto.setCity(client.getCity());
        dto.setEmail(client.getEmail());
        dto.setTin(client.getTin());
        dto.setCreatedAt(client.getCreatedAt());
        dto.setFileCount(cargoFileRepository.countByClientId(client.getId()));
        return dto;
    }
}
