jar xf debezium-connector-sqlserver-2.5.0.Final.jar

jar cf debezium-connector-sqlserver-2.5.0.Final.jar -C ../extract2 .
setx /m JAVA_HOME "C:\Program Files\OpenJDK\jdk-21.0.1"


jar xf kafka-connect-jdbc-10.7.4.jar
jar cf kafka-connect-jdbc-10.7.4.jar -C ../confluent-sink .
