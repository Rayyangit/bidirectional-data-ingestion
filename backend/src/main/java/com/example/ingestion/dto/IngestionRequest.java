package com.example.ingestion.dto;


import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.Map;

public class IngestionRequest {
    @NotNull(message = "Direction is required")
    private Direction direction;
    
    @NotBlank(message = "Table is required")
    private String table;
    
    @NotEmpty(message = "Columns are required")
    private List<String> columns;
    
    private List<String> joinTables;
    private Map<String, String> joinConditions;
    private MultipartFile file;
    private Map<String,String>joinTypes;
    public IngestionRequest() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Map<String, String> getJoinTypes() {
		return joinTypes;
	}
	public void setJoinTypes(Map<String, String> joinTypes) {
		this.joinTypes = joinTypes;
	}
	private int limit=10;
	public int getLimit() {
		return limit;
	}
	public void setLimit(int limit) {
		this.limit = limit;
	}
	public Direction getDirection() {
		return direction;
	}
	public void setDirection(Direction direction) {
		this.direction = direction;
	}
	public String getTable() {
		return table;
	}
	public void setTable(String table) {
		this.table = table;
	}
	public List<String> getColumns() {
		return columns;
	}
	public void setColumns(List<String> columns) {
		this.columns = columns;
	}
	public List<String> getJoinTables() {
		return joinTables;
	}
	public void setJoinTables(List<String> joinTables) {
		this.joinTables = joinTables;
	}
	public Map<String, String> getJoinConditions() {
		return joinConditions;
	}
	public void setJoinConditions(Map<String, String> joinConditions) {
		this.joinConditions = joinConditions;
	}
	public MultipartFile getFile() {
		return file;
	}
	public void setFile(MultipartFile file) {
		this.file = file;
	}
	public IngestionRequest(@NotNull(message = "Direction is required") Direction direction,
			@NotBlank(message = "Table is required") String table,
			@NotEmpty(message = "Columns are required") List<String> columns, List<String> joinTables,
			Map<String, String> joinConditions, MultipartFile file) {
		super();
		this.direction = direction;
		this.table = table;
		this.columns = columns;
		this.joinTables = joinTables;
		this.joinConditions = joinConditions;
		this.file = file;
	}
    
}

