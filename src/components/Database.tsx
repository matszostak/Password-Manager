export default function Database({databaseContent}: {databaseContent: string}) {
    console.log('opened from child')
    return (
        <>
            {databaseContent}
        </>
        // TODO: handle change and saving the database here
    );
}