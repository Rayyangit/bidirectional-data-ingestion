package com.example.ingestion.dto;

import java.util.Map;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;


public class ConnectionRequest {
    @NotBlank(message = "Host is required")
    private String host;
    
    @NotBlank(message = "Port is required")
    private String port;
    
    @NotBlank(message = "Database is required")
    private String database;
    
    @NotBlank(message = "Username is required")
    private String username;
    
    private String password;
    private String jwtToken;
	public String getHost() {
		return host;
	}
	public void setHost(String host) {
		this.host = host;
	}
	public String getPort() {
		return port;
	}
	public void setPort(String port) {
		this.port = port;
	}
	public String getDatabase() {
		return database;
	}
	public void setDatabase(String database) {
		this.database = database;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getJwtToken() {
		return jwtToken;
	}
	public void setJwtToken(String jwtToken) {
		this.jwtToken = jwtToken;
	}
	public ConnectionRequest(String host, String port, String database, String username, String password,
			String jwtToken) {
		super();
		this.host = host;
		this.port = port;
		this.database = database;
		this.username = username;
		this.password = password;
		this.jwtToken = jwtToken;
	}
    
    
}



