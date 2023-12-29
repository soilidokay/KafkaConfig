# https://www.conduktor.io/kafka/how-to-start-kafka-using-docker/
# https://github.com/conduktor/kafka-stack-docker-compose
# https://www.alibabacloud.com/help/en/message-queue-for-apache-kafka/latest/use-kafka-connect-to-synchronize-data-from-an-sql-server-database-to-message-queue-for-apache-kafka
# https://stackoverflow.com/questions/63172483/how-to-install-connectors-to-the-docker-image-of-apache-kafka-connect


# sql connector
# https://debezium.io/documentation/reference/stable/connectors/sqlserver.html#offline-schema-updates

# install debezium-sqlserver-source
# https://docs.confluent.io/kafka-connectors/debezium-sqlserver-source/current/overview.html


# install sink
# https://docs.confluent.io/kafka-connectors/jdbc/current/sink-connector/overview.html#install-the-jdbc-sink-connector

# https://www.dotnetcoban.com/2019/09/config-kafka-in-dotnet.html
# run command
docker exec -it kafka1 /bin/bash
docker-compose -f zk-single-kafka-single.yml up -d
docker-compose -f zk-single-kafka-single.yml stop


## Enable CDC for the database. 
USE [DDT.DestributeTest]
GO
EXEC sys.sp_cdc_enable_db
GO

## Enable CDC for a specified table. 
USE testDB
GO

USE [DDT.DestributeTest]

EXEC sys.sp_cdc_enable_table
@source_schema = N'dbo',
@source_name   = N'AspNetUsers',
@supports_net_changes = 1
@role_name     = N'MyRole',
@filegroup_name = N'MyDB_CT',
GO


EXEC sys.sp_cdc_enable_table
@source_schema = N'dbo',
@source_name   = N'Assets',
@role_name     = null
Go
EXEC sys.sp_cdc_help_change_data_capture

curl -i -X POST -H "Accept:application/json" -H  "Content-Type:application/json" http://localhost:8083/connectors/ -d @register-sqlserver.json
localhost:8083/connector-plugins
# build
docker-compose -f zk-single-kafka-single.yml up -d
docker build -t kafka-addition-plugins:dev .


# web ui
https://github.com/provectus/kafka-ui
docker run -it -p 9595:8080 -e DYNAMIC_CONFIG_ENABLED=true provectuslabs/kafka-ui

git add .; git commit -m "update";git push


# source connector
curl -i -X POST -H "Accept:application/json" -H "Content-Type:application/json" localhost:8083/connectors/ -d '
 { 
 "name": "inventory-connector", 
 "config": { "connector.class": "io.debezium.connector.mysql.MySqlConnector", 
 "tasks.max": "1", 
 "database.hostname": "mysql", 
 "database.port": "3306", 
 "database.user": 
 "debezium", 
 "database.password": "dbz", 
 "database.server.id": "184054", 
 "database.server.name": "dbserver1", 
 "database.include.list": "inventory", 
 "database.history.kafka.bootstrap.servers": "kafka:9092", 
 "database.history.kafka.topic": "dbhistory.inventory" 
 } 
}'


{
    "name": "inventory-connector1",
    "config": {
        "connector.class": "io.debezium.connector.sqlserver.SqlServerConnector", 
        "database.hostname": "master.node.local", 
        "database.port": "32433", 
        "database.user": "sa", 
        "database.password": "Sa123@@@", 
        "database.names": "ATM.AssetManagement.Repli", 
        "topic.prefix": "db_distibutted", 
        "table.include.list": "dbo.AspNetRoles, dbo.Assets, dbo.AudioInfo, dbo.AssetTracks", 
        "schema.history.internal.kafka.bootstrap.servers": "broker:29092", 
        "schema.history.internal.kafka.topic": "schemahistory.db_distibutted",
        "database.encrypt":false
    }
}

{
    "name": "inventory-connectorAll2",
    "config": {
        "connector.class": "io.debezium.connector.sqlserver.SqlServerConnector", 
        "database.hostname": "master.node.local", 
        "database.port": "32433", 
        "database.user": "sa", 
        "database.password": "Sa123@@@", 
        "database.names": "ATM.AssetManagement.Repli", 
        "topic.prefix": "db_distibutted", 
        "schema.history.internal.kafka.bootstrap.servers": "broker:29092", 
        "schema.history.internal.kafka.topic": "schemahistory.db_distibutted",
        "database.encrypt":false
    }
}


# enable all cdc

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

# https://docs.confluent.io/kafka-connectors/jdbc/current/
# sink connector
{
  "topics": "sql_ratings",
  "input.data.format": "AVRO",
  "input.key.format": "AVRO",
  "connector.class": "MicrosoftSqlServerSink",
  "name": "MicrosoftSqlServerSinkConnector_0",
  "kafka.auth.mode": "KAFKA_API_KEY",
  "kafka.api.key": "****************",
  "kafka.api.secret": "****************************************************************",
  "connection.host": "connect-sqlserver-cdc.<host-id>.us-west-2.rds.amazonaws.com",
  "connection.port": "1433",
  "connection.user": "admin",
  "connection.password": "************",
  "db.name": "database-name",
  "insert.mode": "UPSERT",
  "auto.create": "true",
  "auto.evolve": "true",
  "tasks.max": "1",
  "pk.mode": "record_value",
  "pk.fields": "user_id"
}

{
  "name": "JdbcSinkConnectorConnector_0",
  "config": {
    "name": "JdbcSinkConnectorConnector_0",
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "topics": "db_distibutted.ATM.AssetManagement.Repli.dbo.AspNetRoles, db_distibutted.ATM.AssetManagement.Repli.dbo.AspNetUserLogins, db_distibutted.ATM.AssetManagement.Repli.dbo.AspNetUsers, db_distibutted.ATM.AssetManagement.Repli.dbo.AssetLabels, db_distibutted.ATM.AssetManagement.Repli.dbo.Assets",
    "connection.url": "jdbc:sqlserver://master.node.local:32433;databaseName=ATM.AssetManagement.Repli_2;",
    "connection.user": "sa",
    "connection.password": "Sa123@@@",
    "dialect.name": "SqlServerDatabaseDialect",
    "auto.create": "true",
    "auto.evolve": "true"
  }
}

{
  "name": "JdbcSinkConnectorConnector_0",
  "config": {
    "name": "JdbcSinkConnectorConnector_0",
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "topics": "db_distibutted.ATM.AssetManagement.Repli.dbo.AspNetRoles, db_distibutted.ATM.AssetManagement.Repli.dbo.AspNetUserLogins, db_distibutted.ATM.AssetManagement.Repli.dbo.AspNetUsers, db_distibutted.ATM.AssetManagement.Repli.dbo.AssetLabels, db_distibutted.ATM.AssetManagement.Repli.dbo.Assets",
    "connection.host": "master.node.local",
    "connection.port": "32433",
    "connection.user": "sa",
    "connection.password": "Sa123@@@",
    "db.name": "ATM.AssetManagement.Repli_2",
    "auto.create": "true",
    "auto.evolve": "true"
  }
}
# sink ok 
{
  "name": "JdbcSinkConnectorConnector_1",
  "config": {
    "name": "JdbcSinkConnectorConnector_1",
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "topics": "db_distibutted.KafkaSourceDatabase.dbo.RouteNoteAlbum",
    "connection.url": "jdbc:sqlserver://master.node.local:32433;databaseName=db_distibutted;",
    "connection.user": "sa",
    "connection.password": "Sa123@@@",
    "insert.mode": "upsert",
    "delete.enabled": "true",
    "pk.mode": "record_key",
    "pk.fields": "Kafka_Id",
    "auto.create": "true",

    "transforms":"topicToTable,unwrap",

    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",

    "transforms.topicToTable.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.topicToTable.regex": ".*\\.(.*)",
    "transforms.topicToTable.replacement": "$1_kafka",
    "table.name.format": "${topic}"
  }
}