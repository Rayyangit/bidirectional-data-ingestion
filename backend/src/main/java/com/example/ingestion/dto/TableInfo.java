package com.example.ingestion.dto;



public class TableInfo {
    private String name;
    private String engine;
    private String partitionKey;
    
	public TableInfo(String name, String engine, String partitionKey) {
		super();
		this.name = name;
		this.engine = engine;
		this.partitionKey = partitionKey;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEngine() {
		return engine;
	}
	public void setEngine(String engine) {
		this.engine = engine;
	}
	public String getPartitionKey() {
		return partitionKey;
	}
	public void setPartitionKey(String partitionKey) {
		this.partitionKey = partitionKey;
	}
}