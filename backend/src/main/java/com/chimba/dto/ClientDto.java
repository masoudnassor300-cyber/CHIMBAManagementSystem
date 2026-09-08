package com.chimba.dto;

import java.time.LocalDateTime;

public class ClientDto {
    private Integer id;
    private String clientId;
    private String name;
    private String address;
    private String city;
    private String email;
    private String tin;
    private LocalDateTime createdAt;
    private long fileCount;

    public ClientDto() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getClientId() { return clientId; }
    public void setClientId(String clientId) { this.clientId = clientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getTin() { return tin; }
    public void setTin(String tin) { this.tin = tin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public long getFileCount() { return fileCount; }
    public void setFileCount(long fileCount) { this.fileCount = fileCount; }
}
