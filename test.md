let sourceTable = base.getTable("Incoming TeamMembers"); // Anpassen
let targetTable = base.getTable("TeamMembers");

let records = await sourceTable.selectRecordsAsync();

// Funktion zur Extraktion aus HTML
function extractFromHTML(html) {
    const regex = /<a\s+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let matches = [];
    let match;
    while ((match = regex.exec(html)) !== null) {
        matches.push({
            url: match[1].trim(),
            name: match[2].trim()
        });
    }
    return matches;
}

// Funktion zum Entfernen von HTML-Tags und extrahieren von reinem Text
function extractPlainNames(text, htmlMatches) {
    // Entferne HTML komplett
    let withoutTags = text.replace(/<[^>]*>/g, ''); 
    // Split by comma, newline oder Leerzeichen-Kombi
    let candidates = withoutTags.split(/[,|;\n]+/).map(n => n.trim()).filter(Boolean);

    // Filtere nur die Namen raus, die nicht schon als verlinkt erkannt wurden
    let linkedNames = htmlMatches.map(obj => obj.name);
    let plainNames = candidates.filter(name => !linkedNames.includes(name));

    return plainNames.map(name => ({ name, url: "" }));
}

// Hauptverarbeitung
for (let record of records.records) {
    let raw = record.getCellValue("Captain");
    let crewName = record.getCellValue("Crew-Name");
    if (!raw) continue;

    let htmlMatches = extractFromHTML(raw);
    let plainMatches = extractPlainNames(raw, htmlMatches);

    let allCaptains = [...htmlMatches, ...plainMatches];

    for (let entry of allCaptains) {
        await targetTable.createRecordAsync({
            "Name": entry.name,
            "Instagram URL": entry.url,
            "Crew Name": crewName
        });
    }
}