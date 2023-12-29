const dataDefault = {
    "pageCount": 2,
    "schemas": [
        {
            "subject": "db_distibutted.ATM.AssetManagement.Repli.dbo.AudioLabel-value",
            "version": "1",
            "id": 15,
            "schema": "{\"type\":\"record\",\"name\":\"Envelope\",\"namespace\":\"db_distibutted.ATM.AssetManagement.Repli.dbo.AudioLabel\",\"fields\":[{\"name\":\"before\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"Value\",\"fields\":[{\"name\":\"Name\",\"type\":\"string\"},{\"name\":\"Description\",\"type\":[\"null\",\"string\"],\"default\":null},{\"name\":\"UserId\",\"type\":\"string\"},{\"name\":\"DateCreated\",\"type\":{\"type\":\"long\",\"connect.version\":1,\"connect.name\":\"io.debezium.time.NanoTimestamp\"}},{\"name\":\"DateUpdated\",\"type\":{\"type\":\"long\",\"connect.version\":1,\"connect.default\":0,\"connect.name\":\"io.debezium.time.NanoTimestamp\"},\"default\":0}],\"connect.name\":\"db_distibutted.ATM.AssetManagement.Repli.dbo.AudioLabel.Value\"}],\"default\":null},{\"name\":\"after\",\"type\":[\"null\",\"Value\"],\"default\":null},{\"name\":\"source\",\"type\":{\"type\":\"record\",\"name\":\"Source\",\"namespace\":\"io.debezium.connector.sqlserver\",\"fields\":[{\"name\":\"version\",\"type\":\"string\"},{\"name\":\"connector\",\"type\":\"string\"},{\"name\":\"name\",\"type\":\"string\"},{\"name\":\"ts_ms\",\"type\":\"long\"},{\"name\":\"snapshot\",\"type\":[{\"type\":\"string\",\"connect.version\":1,\"connect.parameters\":{\"allowed\":\"true,last,false,incremental\"},\"connect.default\":\"false\",\"connect.name\":\"io.debezium.data.Enum\"},\"null\"],\"default\":\"false\"},{\"name\":\"db\",\"type\":\"string\"},{\"name\":\"sequence\",\"type\":[\"null\",\"string\"],\"default\":null},{\"name\":\"schema\",\"type\":\"string\"},{\"name\":\"table\",\"type\":\"string\"},{\"name\":\"change_lsn\",\"type\":[\"null\",\"string\"],\"default\":null},{\"name\":\"commit_lsn\",\"type\":[\"null\",\"string\"],\"default\":null},{\"name\":\"event_serial_no\",\"type\":[\"null\",\"long\"],\"default\":null}],\"connect.name\":\"io.debezium.connector.sqlserver.Source\"}},{\"name\":\"op\",\"type\":\"string\"},{\"name\":\"ts_ms\",\"type\":[\"null\",\"long\"],\"default\":null},{\"name\":\"transaction\",\"type\":[\"null\",{\"type\":\"record\",\"name\":\"block\",\"namespace\":\"event\",\"fields\":[{\"name\":\"id\",\"type\":\"string\"},{\"name\":\"total_order\",\"type\":\"long\"},{\"name\":\"data_collection_order\",\"type\":\"long\"}],\"connect.version\":1,\"connect.name\":\"event.block\"}],\"default\":null}],\"connect.version\":1,\"connect.name\":\"db_distibutted.ATM.AssetManagement.Repli.dbo.AudioLabel.Envelope\"}",
            "compatibilityLevel": "BACKWARD",
            "schemaType": "AVRO"
        },
    ]
}

const removeScheme = (schemasName) => {
    fetch(`http://localhost:8080/api/clusters/VideoMatch/schemas/${schemasName}`, {
        "credentials": "include",
        method: "DELETE"
    });
}

const getSchema = async (page, perPage) => {
    const res = await fetch(`http://localhost:8080/api/clusters/VideoMatch/schemas?page=${page}&perPage=${perPage}`, {
        "credentials": "include"
    });
    return await res.json()
}


const removeFromSchema = async (resData = dataDefault) => {
    for (let index = 0; index < resData.schemas.length; index++) {
        const element = resData.schemas[index];
        await removeScheme(element.subject)
    }
}

const removeSchemaRange = async () => {
    let resData = dataDefault
    resData = await getSchema(1, 25)
    while ((resData?.schemas?.length ?? 0) > 0) {
        await removeFromSchema(resData)
        resData = await getSchema(1, 25)
    }
}

removeSchemaRange()