package com.example.ingestion.controller;

import com.example.ingestion.dto.ColumnInfo;
import com.example.ingestion.dto.IngestionRequest;
import com.example.ingestion.dto.TableInfo;
import com.example.ingestion.service.ClickHouseService;
import com.example.ingestion.service.DataIngestionService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/clickhouse")
@CrossOrigin(origins = "http://localhost:5173")
public class DataIngestionController {

    private final DataIngestionService dataIngestionService;
    private final ObjectMapper objectMapper;
private final ClickHouseService service;

    public DataIngestionController(DataIngestionService dataIngestionService,ObjectMapper objectMapper,ClickHouseService service) {
        this.dataIngestionService = dataIngestionService;
        this.objectMapper=objectMapper;
        this.service=service;
    }

    @GetMapping("/tables")

    public ResponseEntity<List<TableInfo>> getTables() {
        return ResponseEntity.ok(dataIngestionService.connectAndListTables(null));
    }

    @GetMapping("/columns")
    public ResponseEntity<List<ColumnInfo>> getColumns(
            @RequestParam String table,
            @RequestParam(required = false) List<String> joinTables,
            @RequestParam(required = false) Map<String, String> joinConditions) {
        return ResponseEntity.ok(dataIngestionService.getTableColumns(table, joinTables, joinConditions));
    }

    @PostMapping("/import")
    public ResponseEntity<Map<String, Object>> importCSV(
            @RequestParam String table,
            @RequestParam String columns,  // JSON string
            @RequestParam MultipartFile file) {

        try {
            List<String> columnsList = objectMapper.readValue(columns, new TypeReference<List<String>>() {});
            long records = dataIngestionService.importFromFile(table, columnsList, file);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "records", records
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/export")
    
    public ResponseEntity<Resource> exportCSV(
            @RequestParam String table,
            @RequestParam List<String> columns,
            @RequestParam(required = false) List<String> joinTables,
            @RequestParam(required = false) Map<String, String> joinConditions, @RequestParam(required = false) Map<String, String> joinTypes) throws IOException {
        
        String fileName = "export_" + System.currentTimeMillis() + ".csv";
        Path filePath = Paths.get(fileName);
        
        try {
            File file = dataIngestionService.exportToFile(table, columns, joinTables, joinConditions,joinTypes);
            Resource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(resource.contentLength())
                .body(resource);
        } catch (Exception e) {
            Files.deleteIfExists(filePath);
            throw e;
        }
    }

    @PostMapping("/preview")
    public ResponseEntity<List<Map<String, Object>>> previewDataPost(@RequestBody IngestionRequest request) {
        try {
            List<Map<String, Object>> data = dataIngestionService.previewData(
                    request.getTable(),
                    request.getColumns(),
                    request.getJoinTables(),
                    request.getJoinConditions(),
                    request.getJoinTypes(),
                    request.getLimit()
            );
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
