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

    if (!distributedOn) {
        alert("School and Date required"); return
    }

    const schoolId = document.getElementById('school').value
    const data = await readData(`schools/${schoolId}/log_entries/${distributedOn}`)

    report = []
    const std = document.getElementById('std').value
    const div = document.getElementById('div').value

    for (const logId of Object.keys(data)) {
        log = data[logId]
        admNo = log['admNo']
        studentData = await fetchStudentData(schoolId, admNo)

        // Filtering std and div
        if (std && studentData['std'] != std) { continue }
        if (div && studentData['div'] != div) { continue }

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
            'std': studentData['std'], 'div': studentData['div'], 'gender': studentData['gender'],
            'isExchange': log['isExchange'], 'isReturn': log['isReturn'], 
            'distributedBy': log['distributedBy'],
            'regularSet': regularSet, 'extraSet': extraSet, 'sportsSet': sportsSet,
            'extraBelt': extraBelt
        }
        report.push(row)
    }
    showReport(report, distributedOn)
}

function showReport(report, distributedOn) {
    const tableBody = document.getElementById('reportTableBody')
    tableBody.innerHTML = ""

    if (report.length == 0) {
        tableBody.innerHTML = "<tr><td colspan='12'>No distribution on the selected date</td></tr>"
        return
    }

    let regularTotal = 0
    let extraTotal = 0
    let sportsTotal = 0
    let beltTotal = 0

    for (let i =0; i < report.length; i++) {
        isExchange = report[i]?.isExchange == "1" ? "Yes" : "No"
        isReturn = report[i]?.isReturn == "1" ? "Yes" : "No"

        const tableRow = `<tr>
            <td>${i+1}</td>
            <td>${report[i]?.admNo}</td>
            <td>${report[i]?.name}</td>
            <td>${report[i]?.std + ' ' +report[i]?.div}</td>
            <td>${report[i]?.gender}</td>
            <td>${report[i]?.distributedBy}</td>
            <td>${isExchange}</td>
            <td>${isReturn}</td>
            <td>${report[i]?.regularSet || 0}</td>
            <td>${report[i]?.extraSet || 0}</td>
            <td>${report[i]?.extraBelt || 0}</td>
            <td>${report[i]?.sportsSet || 0}</td>
        </tr>`
        tableBody.innerHTML += tableRow

        if (isExchange == "Yes") continue

        let sign = 1
        if (isReturn == "Yes") sign = -1

        regularTotal += sign * (report[i]?.regularSet || 0)
        extraTotal += sign * (report[i]?.extraSet || 0)
        sportsTotal += sign * (report[i]?.sportsSet || 0)
        beltTotal += sign * (report[i]?.extraBelt || 0)
    }
    tableBody.innerHTML += `<tr>
        <td></td><td></td><td></td>
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

function exportTableToPDF() {
    var { jsPDF } = window.jspdf;
    var doc = new jsPDF();

    // Fetch Header info
    var schoolSelect = document.getElementById('school')
    var schoolIndex = schoolSelect.selectedIndex;
    const schoolName = schoolSelect.options[schoolIndex].innerText;
    const distributedOn = $('#distributedOn').val();
    const std = document.getElementById('std').value
    const div = document.getElementById('div').value 

    // Define header data
    let headerText = `School Name: ${schoolName}\nDate of Distribution: ${distributedOn}\nStandard: ${std}\nDivision: ${div}`;

    // Set font size for the header
    var headerFontSize = 12; // Adjust the font size as needed
    doc.setFontSize(headerFontSize);

    // Add header text to the top
    var headerX = 10; // X position for the header text
    var headerY = 10; // Y position for the header text, starting point
    var lineHeight = 6; // Line height for the text
    var lines = headerText.split('\n');
    lines.forEach((line, index) => {
        doc.text(line, headerX, headerY + (index * lineHeight));
    });

    // Adjust the table position
    var tableY = headerY + (lines.length * lineHeight) + 20;

    // Draw the table
    doc.autoTable({
        html: '#reportTable',
        startY: tableY
    });

    // Define additional data
    let footerText = "Signed By: \nSigned On: ";

    // Set font size for the additional text
    var footerFontSize = 12; // Adjust the font size as needed
    doc.setFontSize(footerFontSize);

    // Calculate positions for the additional data
    var pageHeight = doc.internal.pageSize.height;
    var pageWidth = doc.internal.pageSize.width;
    var padding = 10;
    var bottomY = pageHeight - 2 * padding;

    // Add "Signed By" to the left bottom
    doc.text(footerText, padding, bottomY);

    // Add "Signed On" to the right bottom
    var textWidth = doc.getTextWidth(footerText);
    doc.text(footerText, pageWidth - textWidth - padding, bottomY);

    doc.save('table_data.pdf');
}
