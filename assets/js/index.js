const schoolUniformMap = {
    // Memorial
    "1": {
        "school_uniform": {
            "male": {
                "LKG,UKG": ["Shirt_with_Frill", "Shorts"],
                "1,2,3,4,5": ["HS_Shirt", "Shorts"],
                "6,7,8,9,10,11,12": ["HS_Shirt", "Trouser"]
            },
            "female": {
                "LKG,UKG": ["Tunic"],
                "1,2,3,4,5": ["Pleated_Shirt", "Divider"],
                "6,7,8,9,10,11,12": ["Kali_Shirt", "Waist_Coat", "Pant"]
            }
        },
        "sports_uniform": {
            "male": {
                "LKG,UKG,1,2": ["T_Shirt", "Shorts"],
                "3,4,5,6,7,8,9,10,11,12": ["T_Shirt", "Lower"],
            },
            "female": {
                "LKG,UKG,1,2": ["T_Shirt", "Shorts"],
                "3,4,5,6,7,8,9,10,11,12": ["Waist_Coat", "Lower"]
            }
        },
    },

    // Matriculation
    "2": {
        "school_uniform": {
            "male": {
                "LKG,UKG,1,2,3,4,5": ["HS_Shirt", "Shorts"],
                "6,7,8": ["HS_Shirt", "Trouser"],
                "9,10,11,12": ["FS_Shirt", "Trouser"],
            },
            "female": {
                "LKG,UKG": ["Tunic"],
                "1,2,3,4,5": ["HS_Shirt", "Waist_Coat", "Skirt"],
                "6,7,8,9,10,11,12": ["Kali_Shirt", "SML_W_Coat", "Trouser"]
            }
        },
        "sports_uniform": {
            "male": {
                "LKG,UKG,1,2,3,4,5,6,7,8,9,10,11,12": ["T_Shirt", "Shorts"]
            },
            "female": {
                "LKG,UKG,1,2,3,4,5,6,7,8,9,10,11,12": ["T_Shirt", "Shorts"]
            }
        },
    }
}

async function fetchStudentData() {
    const schoolId = document.getElementById('school').value
    const admNo = document.getElementById('admNo').value
    // console.log(schoolId, admNo)
    if (!schoolId || !admNo) 
        { failMessage("Please provide school and admission number"); return }

    const data = await readData(`schools/${schoolId}/students/${admNo}`)
    try {
        if (data['gender'] == 'M') { data['gender'] = 'male' }
        else { data['gender'] = 'female' }
    } catch (e) {
        failMessage("Failed to fetch student details"); return
    }

    // console.log(data)
    generateStudentTable(data)
    // Uniforms
    generateRegularSet(schoolId, data)
    generateSchoolUniform(schoolId, data)
    generateSportsUniform(schoolId, data)
}

function generateStudentTable(studentData) {
    const tbody = `
    <tbody>
        <tr><td>Admission No</td><td>${studentData.admNo}</td></tr>
        <tr><td>Temporary No</td><td>${studentData?.temporaryNo}</td></tr>
        <tr><td>Name</td><td>${studentData?.name}</td></tr>
        <tr><td>Standard</td><td>${studentData?.std}</td></tr>
        <tr><td>Divison</td><td>${studentData?.div}</td></tr>
        <tr><td>Gender</td><td>${studentData?.gender}</td></tr>
    </tbody>`
    document.getElementById('studentDetails').innerHTML = tbody
}

function generateRegularSet(schoolId, data) {
    const uniformClasses = schoolUniformMap?.[schoolId]["school_uniform"]?.[data.gender] || []
    const uniformClass = Object.keys(uniformClasses).find(x => x.includes(data.std))
    let uniforms =  [...uniformClasses?.[uniformClass] || []]
    uniforms.push("Belts")

    let rows = ''
    for (let i=0; i < uniforms.length; i++) {
        size = data?.["Uniform"]?.[uniforms[i]] || ''
        // console.log(size, uniforms[i])
        rows += `<tr>
            <td>${uniforms[i]}</td>
            <td>
                <input type="text" class="form-control" id="regularSetSize_${i}" value="${size}">
            </td>
            <td>
                <input type="number" class="form-control" id="regularSetQty_${i}">
            </td>
        </tr>`
    }

    const table = `
    <table class="table table-bordered">
        <thead>
            <th>Type</th> <th>Size</th> <th>Qty</th>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>`

    document.getElementById("regularSetDetails").innerHTML = table
}

function generateSchoolUniform(schoolId, data) {
    const uniformClasses = schoolUniformMap?.[schoolId]["school_uniform"]?.[data.gender] || []
    const uniformClass = Object.keys(uniformClasses).find(x => x.includes(data.std))
    const uniforms = uniformClasses?.[uniformClass] || []

    let rows = ''
    for (let i=0; i < uniforms.length; i++) {
        size = data?.["Uniform"]?.[uniforms[i]] || ''
        rows += `<tr>
            <td>${uniforms[i]}</td>
            <td>
                <input type="text" class="form-control" id="schoolUniformSize_${i}" value="${size}">
            </td>
            <td>
                <input type="number" class="form-control" id="schoolUniformQty_${i}">
            </td>
        </tr>`
    }

    const table = `
    <table class="table table-bordered">
        <thead>
            <th>Type</th> <th>Size</th> <th>Qty</th>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>`

    document.getElementById("schoolUniformDetails").innerHTML = table
}

function generateSportsUniform(schoolId, data) {
    const uniformClasses = schoolUniformMap?.[schoolId]["sports_uniform"]?.[data.gender] || []
    const uniformClass = Object.keys(uniformClasses).find(x => x.includes(data.std))
    const uniforms = uniformClasses?.[uniformClass] || []

    let rows = ''
    for (let i=0; i < uniforms.length; i++) {
        size = data?.["Sports"]?.[uniforms[i]] || ''
        rows += `<tr>
            <td>${uniforms[i]}</td>
            <td>
                <input type="text" class="form-control" id="sportsUniformSize_${i}" value="${size}">
            </td>
            <td>
                <input type="number" class="form-control" id="sportsUniformQty_${i}">
            </td>
        </tr>`

    }

    const table = `
    <table class="table table-bordered">
        <thead>
            <th>Type</th> <th>Size</th> <th>Qty</th>
        </thead>
        <tbody>
            ${rows}
        </tbody>
    </table>`

    document.getElementById("sportsUniformDetails").innerHTML = table
}

async function formSubmission(distributedOn) {
    processingMessage();

    try{
        const data = {
            distributedBy: document.getElementById('distributedBy').value,
            distributedOn,
            admNo: document.getElementById('admNo').value,
            isExchange: parseInt(document.getElementById('isExchange').value),
            isReturn: parseInt(document.getElementById('isReturn').value),
    
            isRegularSet: parseInt(document.getElementById('isRegularSet').value),
            isSchoolUniform: parseInt(document.getElementById('isSchoolUniform').value),
            isSportsUniform: parseInt(document.getElementById('isSportsUniform').value),
            
            extraBeltAndSocks: parseInt(document.getElementById('extraBeltAndSocks').value),
            extraBeltQty: parseInt(document.getElementById('extraBeltQty').value) || 0,
            remarks: document.getElementById('remarks').value,
        }

        const schoolId = document.getElementById('school').value
        const studentData = await readData(`schools/${schoolId}/students/${data.admNo}`)
        if (studentData['gender'] == 'M') { studentData['gender'] = 'male' }
        else { studentData['gender'] = 'female' }        

        const uniformClasses = schoolUniformMap?.[schoolId]["school_uniform"]?.[studentData.gender] || []
        const uniformClass = Object.keys(uniformClasses).find(x => x.includes(studentData.std))
    
        const sportsClasses = schoolUniformMap?.[schoolId]["sports_uniform"]?.[studentData.gender] || []
        const sportsClass = Object.keys(sportsClasses).find(x => x.includes(studentData.std))

        if (data.isRegularSet) {
            let uniforms =  [...(uniformClasses?.[uniformClass]) || []]
            uniforms.push("Belts")
            let uniformData = {}
            for (let i=0; i < uniforms.length; i++) {
                size = document.getElementById(`regularSetSize_${i}`).value
                qty = parseInt(document.getElementById(`regularSetQty_${i}`).value)
                uniformData[uniforms[i]] = {size, qty}
            }
            data['regularSet'] = uniformData
        }

        if (data.isSchoolUniform) {
            let uniforms =  [...(uniformClasses?.[uniformClass]) || []]

            let uniformData = {}
            for (let i=0; i < uniforms.length; i++) {
                size = document.getElementById(`schoolUniformSize_${i}`).value
                qty = parseInt(document.getElementById(`schoolUniformQty_${i}`).value)
                uniformData[uniforms[i]] = {size, qty}
            }
            data['schoolUniform'] = uniformData
        }

        if (data.isSportsUniform) {
            let uniforms =  [...(sportsClasses?.[sportsClass]) || []]

            let uniformData = {}
            for (let i=0; i < uniforms.length; i++) {
                size = document.getElementById(`sportsUniformSize_${i}`).value
                qty = parseInt(document.getElementById(`sportsUniformQty_${i}`).value)
                uniformData[uniforms[i]] = {size, qty}
            }
            data['sportsUniform'] = uniformData
        }
    
        // console.log(data)
        const dbPath = `schools/${schoolId}/log_entries/${distributedOn}`
        await writeDataWithNewId(dbPath, data)
        successMessage("Data saved successfully").then(() => location.reload())
    } catch (err) {
        console.log(err)
        failMessage(err)
    }
}