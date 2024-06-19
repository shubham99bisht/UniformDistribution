const schoolReportMap = {
    // Memorial
    "1": {
        "isRegularSet": 0,

        "male_regular_Shirt_with_Frill_size": 0,
        "male_regular_Shirt_with_Frill_qty": 0,
        "male_regular_Shorts_size": 0,
        "male_regular_Shorts_qty": 0,
        "male_regular_HS_Shirt_size": 0,
        "male_regular_HS_Shirt_qty": 0,
        "male_regular_Trouser_size": 0,
        "male_regular_Trouser_qty": 0,

        "female_regular_Tunic_size": 0,
        "female_regular_Tunic_qty": 0,
        "female_regular_Pleated_Shirt_size": 0,
        "female_regular_Pleated_Shirt_qty": 0,
        "female_regular_Divider_size": 0,
        "female_regular_Divider_qty": 0,
        "female_regular_Kali_Shirt_size": 0,
        "female_regular_Kali_Shirt_qty": 0,
        "female_regular_Waist_Coat_size": 0,
        "female_regular_Waist_Coat_qty": 0,
        "female_regular_Pant_size": 0,
        "female_regular_Pant_qty": 0,

        "regular_BeltAndSocks_qty": 0,

        "isExtraSet": 0,

        "male_extra_Shirt_with_Frill_size": 0,
        "male_extra_Shirt_with_Frill_qty": 0,
        "male_extra_Shorts_size": 0,
        "male_extra_Shorts_qty": 0,
        "male_extra_HS_Shirt_size": 0,
        "male_extra_HS_Shirt_qty": 0,
        "male_extra_Trouser_size": 0,      
        "male_extra_Trouser_qty": 0,      
        
        "female_extra_Tunic_size": 0,
        "female_extra_Tunic_qty": 0,
        "female_extra_Pleated_Shirt_size": 0,
        "female_extra_Pleated_Shirt_qty": 0,
        "female_extra_Divider_size": 0,
        "female_extra_Divider_qty": 0,
        "female_extra_Kali_Shirt_size": 0,
        "female_extra_Kali_Shirt_qty": 0,
        "female_extra_Waist_Coat_size": 0,
        "female_extra_Waist_Coat_qty": 0,
        "female_extra_Pant_size": 0,
        "female_extra_Pant_qty": 0,

        "extra_BeltAndSocks_qty": 0,

        "isSportsSet": 0,

        "male_sports_T_Shirt_size": 0,
        "male_sports_T_Shirt_qty": 0,
        "male_sports_Shorts_size": 0,
        "male_sports_Shorts_qty": 0,
        "male_sports_Lower_size": 0,
        "male_sports_Lower_qty": 0,

        "female_sports_T_Shirt_size": 0,
        "female_sports_T_Shirt_qty": 0,
        "female_sports_Shorts_size": 0,
        "female_sports_Shorts_qty": 0,
        "female_sports_Waist_Coat_size": 0,
        "female_sports_Waist_Coat_qty": 0,
        "female_sports_Lower_size": 0,        
        "female_sports_Lower_qty": 0,        
    },
    // Matriculation
    "2": {
        "isRegularSet": 0,

        "male_regular_HS_Shirt_size": 0,
        "male_regular_HS_Shirt_qty": 0,
        "male_regular_Shorts_size": 0,
        "male_regular_Shorts_qty": 0,
        "male_regular_FS_Shirt_size": 0,
        "male_regular_FS_Shirt_qty": 0,
        "male_regular_Trouser_size": 0,
        "male_regular_Trouser_qty": 0,

        "female_regular_Tunic_size": 0,
        "female_regular_Tunic_qty": 0,
        "female_regular_HS_Shirt_size": 0,
        "female_regular_HS_Shirt_qty": 0,
        "female_regular_Waist_Coat_size": 0,
        "female_regular_Waist_Coat_qty": 0,
        "female_regular_Skirt_size": 0,
        "female_regular_Skirt_qty": 0,
        "female_regular_Kali_Shirt_size": 0,
        "female_regular_Kali_Shirt_qty": 0,
        "female_regular_SML_W_Coat_size": 0,
        "female_regular_SML_W_Coat_qty": 0,
        "female_regular_Trouser_size": 0,
        "female_regular_Trouser_qty": 0,

        "regular_BeltAndSocks_qty": 0,

        "isExtraSet": 0,

        "male_extra_HS_Shirt_size": 0,
        "male_extra_HS_Shirt_qty": 0,
        "male_extra_Shorts_size": 0,
        "male_extra_Shorts_qty": 0,
        "male_extra_FS_Shirt_size": 0,
        "male_extra_FS_Shirt_qty": 0,
        "male_extra_Trouser_size": 0,
        "male_extra_Trouser_qty": 0,

        "female_extra_Tunic_size": 0,
        "female_extra_Tunic_qty": 0,
        "female_extra_HS_Shirt_size": 0,
        "female_extra_HS_Shirt_qty": 0,
        "female_extra_Waist_Coat_size": 0,
        "female_extra_Waist_Coat_qty": 0,
        "female_extra_Skirt_size": 0,
        "female_extra_Skirt_qty": 0,
        "female_extra_Kali_Shirt_size": 0,
        "female_extra_Kali_Shirt_qty": 0,
        "female_extra_SML_W_Coat_size": 0,
        "female_extra_SML_W_Coat_qty": 0,
        "female_extra_Trouser_size": 0,
        "female_extra_Trouser_qty": 0,

        "extra_BeltAndSocks_qty": 0,

        "isSportsSet": 0,

        "male_sports_T_Shirt_size": 0,
        "male_sports_T_Shirt_qty": 0,
        "male_sports_Shorts_size": 0,
        "male_sports_Shorts_qty": 0,
        "female_sports_T_Shirt_size": 0,
        "female_sports_T_Shirt_qty": 0,
        "female_sports_Shorts_size": 0,
        "female_sports_Shorts_qty": 0,
    }
}

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

// Function to format the date as YYYY-MM-DD
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

async function fetchReportData(schoolId, startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const schoolName = schoolNameMap[schoolId]

    const data = []
    // Loop from start date to end date
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        const distributedOn = formatDate(new Date(date));
        const d = await readData(`schools/${schoolId}/log_entries/${distributedOn}`)
        if (!d) continue
        data.push(...Object.values(d))
    }

    const report = []
    for (let logId=0; logId < data.length; logId++) {
        log = data[logId]
        admNo = log['admNo']
        studentData = await fetchStudentData(schoolId, admNo)
        
        // Check studentData
        if (!Object.keys(studentData).length) continue

        delete studentData['Uniform']
        delete studentData['Sports']

        reportData = {
            distributedBy: log['distributedBy'],
            distributedOn: log['distributedOn'],
            school: schoolName,
            ...studentData,
            isExchange: log['isExchange'],
            isReturn: log['isReturn'],
            ...schoolReportMap[schoolId],
            remarks: log['remarks']
        }

        if (log['isRegularSet']) { 
            reportData['isRegularSet'] = 1
            Object.keys(log.regularSet).forEach(k => {
                const key = `${studentData['gender']}_regular_${k}`
                if (k == 'Belts_and_Socks') {
                    reportData['regular_BeltAndSocks_qty'] = log.regularSet[k].qty
                } else {
                    reportData[`${key}_qty`] = log.regularSet[k].qty;
                    reportData[`${key}_size`] = log.regularSet[k].size;
                }
            });
        }

        if (log['isSchoolUniform']) { 
            reportData['isExtraSet'] = 1
            Object.keys(log.schoolUniform).forEach(k => {
                const key = `${studentData['gender']}_extra_${k}`
                reportData[`${key}_qty`] = log.schoolUniform[k].qty;
                reportData[`${key}_size`] = log.schoolUniform[k].size;
            });
        }

        if (log['isSportsUniform']) { 
            reportData['isSportsSet'] = 1
            Object.keys(log.sportsUniform).forEach(k => {
                const key = `${studentData['gender']}_sports_${k}`
                reportData[`${key}_qty`] = log.sportsUniform[k].qty;
                reportData[`${key}_size`] = log.sportsUniform[k].size;
            });
        }

        if (log['extraBeltAndSocks']) {
            reportData['extra_BeltAndSocks_qty'] = log["extraBeltQty"]
        }

        report.push(reportData)
    }
    return report
}

async function exportToCSV(filename) {
    const startDate = $('#startDate').val();
    const endDate = $('#endDate').val();
    const schoolId = document.getElementById("school").value;

    if (!startDate || !endDate || !schoolId) {
        alert("All inputs are required"); return
    }

    console.log(schoolId, startDate, endDate)
    const rows = await fetchReportData(schoolId, startDate, endDate)
    console.log(rows)

    let csv = [];
    const keys = Object.keys(rows[0])
    csv.push('#,' + keys.join(","));
    
    for (let i = 0; i < rows.length; i++) {
        const values = Object.values(rows[i])
        csv.push(`${i+1},` + values.join(",").replace(/\n/g, ". "));
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
