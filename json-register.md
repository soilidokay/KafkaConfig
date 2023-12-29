# localhost:8083/connectors/

# source connetor
# https://github.com/debezium/debezium
{
    "name": "inventory_connectorAll",
    "config": {
        "connector.class": "io.debezium.connector.sqlserver.SqlServerConnector", 
        "database.hostname": "master.node.local", 
        "database.port": "32433", 
        "database.user": "sa", 
        "database.password": "Sa123@@@", 
        "database.names": "KafkaSourceDatabase", 
        "topic.prefix": "db_distibutted", 
        "schema.history.internal.kafka.bootstrap.servers": "broker:29092", 
        "schema.history.internal.kafka.topic": "schemahistory.db_distibutted",
        "database.encrypt":false,
        "connection.charset": "UTF-8"
    }
}

curl --location --request DELETE 'localhost:8083/connectors/JdbcSinkConnectorConnector_0' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
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
}'

# Sink connector
# https://github.com/confluentinc/kafka-connect-jdbc/tree/master
{
  "name": "JdbcSinkConnectorConnector_0",
  "config": {
    "tasks.max": "1",  
    "name": "JdbcSinkConnectorConnector_0",
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "topics.regex": "db_distibutted[.].*",
    "connection.url": "jdbc:sqlserver://master.node.local:32433;databaseName=db_distibutted;",
    "connection.user": "sa",
    "connection.password": "Sa123@@@",
    "insert.mode": "upsert",
    "delete.enabled": "true",
    "pk.mode": "record_key",
    "pk.fields": "Kafka_Id",
    "auto.create": "true",
    "dialect.name": "SqlServerDatabaseDialect",

    "transforms":"topicToTable,unwrap",

    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",

    "transforms.topicToTable.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.topicToTable.regex": ".*\\.(.*)",
    "transforms.topicToTable.replacement": "$1",
    "table.name.format": "${topic}",
    
    "key.converter.schemas.enable": "true",
    "value.converter.schemas.enable": "true",
    "key.converter.encoding": "UTF-8",
    "value.converter.encoding": "UTF-8"
  }
}

curl --location 'localhost:8083/connectors/' \
--header 'Accept: application/json' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "JdbcSinkConnectorConnector_0",
  "config": {
    "tasks.max": "1",  
    "name": "JdbcSinkConnectorConnector_0",
    "connector.class": "io.confluent.connect.jdbc.JdbcSinkConnector",
    "topics.regex": "db_distibutted[.].*",
    "connection.url": "jdbc:sqlserver://master.node.local:32433;databaseName=db_distibutted;",
    "connection.user": "sa",
    "connection.password": "Sa123@@@",
    "insert.mode": "upsert",
    "delete.enabled": "true",
    "pk.mode": "record_key",
    "pk.fields": "Kafka_Id",
    "auto.create": "true",
    "dialect.name": "SqlServerDatabaseDialect",

    "transforms":"topicToTable,unwrap",

    "transforms.unwrap.type": "io.debezium.transforms.ExtractNewRecordState",

    "transforms.topicToTable.type": "org.apache.kafka.connect.transforms.RegexRouter",
    "transforms.topicToTable.regex": ".*\\.(.*)",
    "transforms.topicToTable.replacement": "$1",
    "table.name.format": "${topic}",
    
    "key.converter.schemas.enable": "true",
    "value.converter.schemas.enable": "true",
    "key.converter.encoding": "UTF-8",
    "value.converter.encoding": "UTF-8"
  }
}'