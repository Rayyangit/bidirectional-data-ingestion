package com.example.ingestion.service;




import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.ingestion.exception.IngestionException;
import com.opencsv.CSVReaderHeaderAware;
import com.opencsv.CSVWriter;



import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
@Service

public class CsvService {

    @Value("${file.storage.location}")
    private String fileStorageLocation;

    public List<Map<String, String>> parseCsv(MultipartFile file) throws IOException {
        validateFile(file);
        
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReaderHeaderAware csvReader = new CSVReaderHeaderAware(reader)) {
            
            List<Map<String, String>> records = new ArrayList<>();
            Map<String, String> record;
            
            while ((record = csvReader.readMap()) != null) {
                records.add(record);
            }
            
            return records;
        } catch (Exception e) {
           
            throw new IngestionException("Failed to parse CSV file: " + e.getMessage());
        }
    }
    public File exportToCsv(List<Map<String, Object>> data, List<String> headers) throws IOException {
        // Validate input parameters
        if (headers == null || headers.isEmpty()) {
            throw new IllegalArgumentException("Headers cannot be null or empty");
        }
        
        if (data == null) {
            throw new IllegalArgumentException("Data cannot be null");
        }

        // Create directory if it doesn't exist
        Path uploadPath = Paths.get(fileStorageLocation);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);  // This uses java.nio.file.Path
        }

        // Create unique filename
        String fileName = "export_" + System.currentTimeMillis() + ".csv";
        File file = uploadPath.resolve(fileName).toFile();
        
        try (CSVWriter csvWriter = new CSVWriter(new FileWriter(file))) {
            // Write header
            csvWriter.writeNext(headers.toArray(new String[0]));
            
            // Write data rows
            for (Map<String, Object> row : data) {
                if (row == null) continue;
                
                String[] values = new String[headers.size()];
                for (int i = 0; i < headers.size(); i++) {
                    Object value = row.get(headers.get(i));
                    values[i] = (value != null) ? value.toString() : "";
                }
                csvWriter.writeNext(values);
            }
            
            return file;
        } catch (IOException e) {
            // Clean up partially written file if error occurs
            if (file.exists() && !file.delete()) {
                throw new IOException("Failed to delete partial file after export error", e);
            }
            throw new IOException("Failed to write CSV file: " + e.getMessage(), e);
        }
    }
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IngestionException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.equals("text/csv")) {
            throw new IngestionException("Only CSV files are allowed");
        }
    }
}