export default function Database({databaseContent}: {databaseContent: string}) {
    let parsedContent = JSON.parse(databaseContent)

    let name: string = parsedContent.name // database name from JSON
    let creationDate: string = parsedContent.creationdate // database creationdate from JSON
    let dbVault = parsedContent.vault // database vault

    console.log(dbVault)
    console.log('tytyt', dbVault[0].metadata.timesmodified)

    return (
        <>
            <div>Name: {name}</div>
            <div>Creation date: {creationDate}</div>
            <div>========================</div>
            <div>vault:</div>
            <div>Vault item ID: {dbVault[0].id}</div>
            <div>Username: {dbVault[0].username}</div>
            <div>Password: {dbVault[0].password}</div>
            <div>URLs: {dbVault[0].urls}</div>
            <div>Notes: {dbVault[0].notes}</div>
            <div>========================</div>
            <div>metadata:</div>
            <div>Created: {dbVault[0].metadata.created}</div>
            <div>Last modified: {dbVault[0].metadata.lastmodified}</div>
            <div>Times modified: {dbVault[0].metadata.timesmodified}</div>

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