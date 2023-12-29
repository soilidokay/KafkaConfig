
# enable all cdc
```
EXEC sys.sp_cdc_enable_db
GO


DECLARE @tableName NVARCHAR(MAX);
DECLARE tableCursor CURSOR FOR
SELECT name
FROM sys.tables;

OPEN tableCursor;
FETCH NEXT FROM tableCursor INTO @tableName;

WHILE @@FETCH_STATUS = 0
BEGIN
    EXEC sys.sp_cdc_enable_table
        @source_schema = 'dbo',
        @source_name = @tableName,
        @role_name = NULL, -- Specify the role if needed
        @supports_net_changes = 1;

    FETCH NEXT FROM tableCursor INTO @tableName;
END;

CLOSE tableCursor;
DEALLOCATE tableCursor;
Go
EXEC sys.sp_cdc_help_change_data_capture
```
