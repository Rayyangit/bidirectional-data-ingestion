package com.example.ingestion.service;

import com.example.ingestion.dto.ColumnInfo;
import com.example.ingestion.dto.TableInfo;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface ClickHouseService {
    List<TableInfo> listTables();
    List<ColumnInfo> getColumnsForTable(String table);
    List<ColumnInfo> getTableColumns(String table, List<String> joinTables, Map<String, String> joinConditions);
    List<Map<String, Object>> previewData(String table, List<String> columns, 
                                        List<String> joinTables, Map<String, String> joinConditions,Map<String,String>joinTypes,
                                        int limit);
    List<Map<String, String>> parseCsv(MultipartFile file) throws IOException;
    File exportToCsv(List<Map<String, Object>> data, List<String> headers, String outputPath) throws IOException;
	long importFromFile(String table, List<String> columns, List<Map<String, String>> data);
}