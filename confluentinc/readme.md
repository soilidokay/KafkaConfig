# https://jskim1991.medium.com/docker-docker-compose-example-for-kafka-zookeeper-and-schema-registry-c516422532e7
# https://docs.confluent.io/platform/current/platform-quickstart.html
# example
-   https://github.com/confluentinc/cp-all-in-one/blob/7.5.0-post/cp-all-in-one/docker-compose.yml
-   https://github.com/confluentinc/cp-all-in-one/blob/7.6.x/cp-all-in-one/docker-compose.yml

# https://docs.confluent.io/kafka-connectors/debezium-sqlserver-source/current/overview.html
docker exec -it confluentinc-cp-kafka-connect confluent-hub install debezium/debezium-connector-mysql:1.7.1
confluent-hub install debezium/debezium-connector-sqlserver:latest