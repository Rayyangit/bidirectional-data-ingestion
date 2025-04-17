package com.example.ingestion.dto;



public class ColumnInfo {
    private String name;
    private String type;
    private String defaultType;
    private String comment;
	public ColumnInfo(String name, String type, String defaultType, String comment) {
		super();
		this.name = name;
		this.type = type;
		this.defaultType = defaultType;
		this.comment = comment;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDefaultType() {
		return defaultType;
	}
	public void setDefaultType(String defaultType) {
		this.defaultType = defaultType;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
}
