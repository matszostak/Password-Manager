export default function Database({databaseContent}: {databaseContent: string}) {
    let parsedContent = JSON.parse(databaseContent)
    let name: string = parsedContent.name // database name from JSON
    let creationDate: string = parsedContent.creationdate // database creationdate from JSON
    let dbVault = parsedContent.vault // database vault
    console.log(dbVault)
    console.log('tytyt', dbVault[0].metadata.timesmodified)
    //console.log(medadata['timesmodified' as any])
    return (
        <>
            {name + '\n'}
            {creationDate + '\n'}
            {creationDate + '\n'}
        </>
        // TODO: handle change and saving the database here
    );
}

/*
{
    "name": "",
    "creationdate": "",
    "vault": [
        {
            "id": "",
            "username": "",
            "password": "",
            "urls": [],
            "notes": "",
            "metadata": {
                "created": "",
                "lastmodified": "",
                "timesmodified": 0
            }
        }
    ]
}
*/