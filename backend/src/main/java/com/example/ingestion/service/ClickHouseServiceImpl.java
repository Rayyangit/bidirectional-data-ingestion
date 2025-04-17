package com.example.ingestion.service;

import com.example.ingestion.dto.ColumnInfo;
import com.example.ingestion.dto.TableInfo;
import com.example.ingestion.exception.IngestionException;
import com.opencsv.CSVReaderHeaderAware;
import com.opencsv.CSVWriter;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.jdbc.core.BatchPreparedStatementSetter;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Types;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ClickHouseServiceImpl implements ClickHouseService {

    private final JdbcTemplate jdbcTemplate;

    public ClickHouseServiceImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<TableInfo> listTables() {
        String sql = "SELECT name, engine, partition_key FROM system.tables WHERE database = currentDatabase()";
        return jdbcTemplate.query(sql, (rs, rowNum) -> 
            new TableInfo(
                rs.getString("name"),
                rs.getString("engine"),
                rs.getString("partition_key")
            ));
    }

    @Override
    public List<ColumnInfo> getTableColumns(String table, List<String> joinTables, Map<String, String> joinConditions) {
        List<ColumnInfo> columns = new ArrayList<>();
        columns.addAll(getColumnsForTable(table));
        
        if (joinTables != null) {
            for (String joinTable : joinTables) {
                if (!joinTable.matches("[a-zA-Z0-9_]+")) {
                    throw new IllegalArgumentException("Invalid join table name");
                }
                columns.addAll(getColumnsForTable(joinTable));
            }
        }
        return columns;
    }

    @Override
    public List<ColumnInfo> getColumnsForTable(String table) {
        if (!table.matches("[a-zA-Z0-9_]+")) {
            throw new IllegalArgumentException("Invalid table name");
        }
        String sql = String.format("DESCRIBE TABLE `%s`", table);
        return jdbcTemplate.query(sql, (rs, rowNum) -> 
            new ColumnInfo(
                rs.getString("name"),
                rs.getString("type"),
                rs.getString("default_type"),
                rs.getString("comment")
            ));
    }

    @Override
    public List<Map<String, Object>> previewData(String table, List<String> columns, 
                                               List<String> joinTables, Map<String, String> joinConditions,Map<String,String>joinTypes,
                                               int limit) {
        String query = buildQuery(table, columns, joinTables, joinConditions,joinTypes, limit);
        return jdbcTemplate.queryForList(query);
    }

   public long importFromFile(String table, List<String> columns, List<Map<String, String>> data) {
        if (table == null || table.trim().isEmpty()) {
            throw new IllegalArgumentException("Table name is required.");
        }
        if (columns == null || columns.isEmpty()) {
            throw new IllegalArgumentException("Columns list is required.");
        }
        if (data == null || data.isEmpty()) {
            return 0;
        }

        try {
            String sql =  buildClickHouseInsertSQL(table, columns);
            int[] result = jdbcTemplate.batchUpdate(sql, new BatchPreparedStatementSetter() {
                @Override
                public void setValues(PreparedStatement ps, int i) throws SQLException {
                    Map<String, String> row = data.get(i);
                    for (int j = 0; j < columns.size(); j++) {
                        ps.setString(j + 1, row.getOrDefault(columns.get(j), ""));
                    }
                }
                @Override
                public int getBatchSize() {
                    return data.size();
                }
            });

            return Arrays.stream(result).sum();
        } catch (Exception e) {
           throw new IngestionException("ClickHouse import failed: " + e.getMessage(), e);
        }
    }
    
    


    private String buildClickHouseInsertSQL(String table, List<String> columns) {
        // ClickHouse prefers simple column names without backticks
        String columnList = String.join(", ", columns);
        String placeholders = String.join(", ", 
            Collections.nCopies(columns.size(), "?"));
        
        return String.format("INSERT INTO %s (%s) VALUES (%s)",
            table, columnList, placeholders);
    }
    @Override
    public List<Map<String, String>> parseCsv(MultipartFile file) throws IOException {
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVReaderHeaderAware csvReader = new CSVReaderHeaderAware(reader)) {
            
            List<Map<String, String>> records = new ArrayList<>();
            Map<String, String> record;
            
            while ((record = csvReader.readMap()) != null) {
                records.add(record);
            }
            return records;
        } catch (CsvValidationException e) {
            throw new IOException("Failed to parse CSV file", e);
        }
    }

    @Override
    public File exportToCsv(List<Map<String, Object>> data, List<String> headers, String outputPath) throws IOException {
        try (CSVWriter csvWriter = new CSVWriter(new FileWriter(outputPath))) {
            csvWriter.writeNext(headers.toArray(new String[0]));
            
            for (Map<String, Object> row : data) {
                String[] values = new String[headers.size()];
                for (int i = 0; i < headers.size(); i++) {
                    Object value = row.get(headers.get(i));
                    values[i] = (value != null) ? value.toString() : "";
                }
                csvWriter.writeNext(values);
            }
            return new File(outputPath);
        }
    }

    private String buildQuery(String table, List<String> columns,
            List<String> joinTables,
            Map<String, String> joinConditions,
            Map<String, String> joinTypes,
            int limit) {
StringBuilder query = new StringBuilder("SELECT ");
query.append(String.join(", ", columns));
query.append(" FROM ").append(table);

if (joinTables != null && !joinTables.isEmpty() && joinConditions != null) {
for (String joinTable : joinTables) {
String condition = joinConditions.get(joinTable);
if (condition != null && !condition.isEmpty()) {
  String joinType = "JOIN"; // Default to INNER JOIN
  if (joinTypes != null && joinTypes.containsKey(joinTable)) {
      joinType = joinTypes.get(joinTable).toUpperCase();
      // Validate join type
      if (!List.of("JOIN", "INNER JOIN", "LEFT JOIN", "RIGHT JOIN").contains(joinType)) {
          throw new IllegalArgumentException("Unsupported join type: " + joinType);
      }
  }
  query.append(" ").append(joinType).append(" ").append(joinTable)
       .append(" ON ").append(condition);
}
}
}

if (limit > 0) {
query.append(" LIMIT ").append(limit);
}

return query.toString();
}



}