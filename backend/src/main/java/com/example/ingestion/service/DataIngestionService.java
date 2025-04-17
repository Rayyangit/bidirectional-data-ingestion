package com.example.ingestion.service;

import com.example.ingestion.dto.*;
import com.example.ingestion.exception.IngestionException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class DataIngestionService {

    private final ClickHouseService clickHouseService;

    public DataIngestionService(ClickHouseService clickHouseService) {
        this.clickHouseService = clickHouseService;
    }

    public List<TableInfo> connectAndListTables(ConnectionRequest request) {
        try {
            return clickHouseService.listTables();
        } catch (Exception e) {
            throw new IngestionException("Failed to connect to ClickHouse: " + e.getMessage(), e);
        }
    }

    public List<ColumnInfo> getTableColumns(String table, List<String> joinTables, 
                                          Map<String, String> joinConditions) {
        try {
            return clickHouseService.getTableColumns(table, joinTables, joinConditions);
        } catch (Exception e) {
            throw new IngestionException("Failed to get columns: " + e.getMessage(), e);
        }
    }

    public List<Map<String, Object>> previewData(String table, List<String> columns, 
                                               List<String> joinTables, Map<String, String> joinConditions,Map<String,String>joinTypes,
                                               int limit) {
        try {
            return clickHouseService.previewData(table, columns, joinTables, joinConditions,joinTypes, limit);
        } catch (Exception e) {
            throw new IngestionException("Failed to preview data: " + e.getMessage(), e);
        }
    }

    public long importFromFile(String table, List<String> columns, MultipartFile file) {
        try {
            List<Map<String, String>> data = clickHouseService.parseCsv(file);
            return clickHouseService.importFromFile(table, columns, data);
        } catch (Exception e) {
            throw new IngestionException("Import failed: " + e.getMessage(), e);
        }
    }
    public File exportToFile(String table, List<String> columns, 
                           List<String> joinTables, Map<String, String> joinConditions,Map<String,String>joinTypes) {
        try {
            List<Map<String, Object>> data = clickHouseService.previewData(
                table, columns, joinTables, joinConditions,joinTypes, -1);
            String outputPath = "./export_" + System.currentTimeMillis() + ".csv";
            return clickHouseService.exportToCsv(data, columns, outputPath);
        } catch (Exception e) {
            throw new IngestionException("Export failed: " + e.getMessage(), e);
        }
    }

    public File startIngestion(IngestionRequest request) {
        try {
            if (request.getDirection() == Direction.CLICKHOUSE_TO_FILE) {
                return exportToFile(
                    request.getTable(), 
                    request.getColumns(),
                    request.getJoinTables(),
                    request.getJoinConditions(),
                    request.getJoinTypes()
                );
            } else {
                importFromFile(
                    request.getTable(),
                    request.getColumns(),
                    request.getFile()
                );
                return null;
            }
        } catch (Exception e) {
            throw new IngestionException("Ingestion failed: " + e.getMessage(), e);
        }
    }
}