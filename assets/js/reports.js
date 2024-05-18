async function fetchStudentData(schoolId, admNo) {
    if (!schoolId || !admNo) return {}

    const data = await readData(`schools/${schoolId}/students/${admNo}`)
    try {
        if (data['gender'] == 'M') { data['gender'] = 'male' }
        else { data['gender'] = 'female' }
    } catch (e) {
       return {}
    }
    return data
}

async function fetchReportData(distributedOn) {
    const schoolId = document.getElementById('school').value    
    const data = await readData(`schools/${schoolId}/log_entries/${distributedOn}`)
    console.log(data)
    report = []

    for (const logId of Object.keys(data)) {
        log = data[logId]
        admNo = log['admNo']
        studentData = await fetchStudentData(schoolId, admNo)
        let gender = 'female'
        if (studentData['gender'] == 'm') { gender = 'male'}

        let regularSet = 0
        if (log['isRegularSet']) { 
            dress = Object.keys(log["regularSet"])[0]
            regularSet = log["regularSet"][dress]["qty"]
        }

        let extraSet = 0
        if (log['isSchoolUniform']) { 
            dress = Object.keys(log["schoolUniform"])[0]
            extraSet = log["schoolUniform"][dress]["qty"]
        }

        let sportsSet = 0
        if (log['isSportsUniform']) { 
            dress = Object.keys(log["sportsUniform"])[0]
            sportsSet = log["sportsUniform"][dress]["qty"]
        }

        let extraBelt = 0
        if (log['extraBeltAndSocks']) { 
            extraBelt = log["extraBeltQty"]
        }

        row = {
            'admNo': admNo, 'name': studentData['name'],
            'std': studentData['std'], 'div': studentData['div'], 'gender': gender,
            'regularSet': regularSet, 'extraSet': extraSet, 'sportsSet': sportsSet,
            'extraBelt': extraBelt
        }
        report.push(row)
        console.log(report)
    }
    showReport(report, distributedOn)
}

function showReport(report, distributedOn) {
    console.log(report)
    const tableBody = document.getElementById('reportTableBody')
    tableBody.innerHTML = ""

    if (report.length == 0) {
        tableBody.innerHTML = "<tr><td colspan='9'>No distribution on the selected date</td></tr>"
        return
    }

    let regularTotal = 0
    let extraTotal = 0
    let sportsTotal = 0
    let beltTotal = 0

    for (let i =0; i < report.length; i++) {
        regularTotal += (report[i]?.regularSet || 0)
        extraTotal += (report[i]?.extraSet || 0)
        sportsTotal += (report[i]?.sportsSet || 0)
        beltTotal += (report[i]?.extraBelt || 0)

        const tableRow = `<tr>
            <td>${i+1}</td>
            <td>${distributedOn}</td>
            <td>${report[i]?.admNo}</td>
            <td>${report[i]?.name}</td>
            <td>${report[i]?.std + ' ' +report[i]?.div}</td>
            <td>${report[i]?.regularSet || 0}</td>
            <td>${report[i]?.extraSet || 0}</td>
            <td>${report[i]?.extraBelt || 0}</td>
            <td>${report[i]?.sportsSet || 0}</td>
        </tr>`
        tableBody.innerHTML += tableRow
    }
    tableBody.innerHTML += `<tr>
        <td></td><td></td><td></td><td></td>
        <td>Total</td><td>${regularTotal}</td><td>${extraTotal}</td><td>${beltTotal}</td><td>${sportsTotal}</td>
    </tr>`
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

// Export table to PDF
function exportTableToPDF() {
    var { jsPDF } = window.jspdf;
    var doc = new jsPDF();
    doc.autoTable({ html: '#reportTable' });

    // Define additional data
    let text = "Signed By: \nSigned On: ";

    // Set font size for the additional text
    var fontSize = 12; // Adjust the font size as needed
    doc.setFontSize(fontSize);

    // Calculate positions for the additional data
    var pageHeight = doc.internal.pageSize.height;
    var pageWidth = doc.internal.pageSize.width;
    var padding = 10;
    var bottomY = pageHeight - 2 * padding;

    // Add "Signed By" to the left bottom
    doc.text(text, padding, bottomY);

    // Add "Signed On" to the right bottom
    var textWidth = doc.getTextWidth(text);
    doc.text(text, pageWidth - textWidth - padding, bottomY);    

    doc.save('table_data.pdf');
}