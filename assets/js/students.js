async function generateStudentTable() {
    const schoolId = document.getElementById('school').value

    if (!schoolId) 
        { failMessage("Please select school"); return }

    const data = await readData(`schools/${schoolId}/students/`)
    const tableBody = document.getElementById('studentBody')
    tableBody.innerHTML = ''

    let i = 0;
    for (let stId of Object.keys(data).slice(1,100)) {
        i += 1;
        let studentData = data[stId]
        try {
            if (studentData['gender'] == 'M') { studentData['gender'] = 'male' }
            else { studentData['gender'] = 'female' }
        } catch (e) {
            failMessage("Failed to fetch student details"); continue
        }

        const row = `<tr>
            <td>${i}</td>
            <td>${studentData['admNo']}</td>
            <td>${studentData['name']}</td>
            <td>${studentData['std']}</td>
            <td>${studentData['div']}</td>
            <td>${studentData['gender']}</td>
            <td><button class="btn btn-primary" disabled>Edit</button></td>
        </tr>`
        tableBody.innerHTML += row
    }
}

function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");

        for (var j = 0; j < cols.length; j++) {
            var cell = cols[j].innerText.replace(/"/g, '""'); // Escape double quotes
            row.push('"' + cell + '"');
        }

        csv.push(row.join(","));
    }

    // Download CSV file
    var csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    var downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
