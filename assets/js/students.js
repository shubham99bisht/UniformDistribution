async function generateStudentTable() {
    const schoolId = document.getElementById('school').value

    if (!schoolId) 
        { failMessage("Please select school"); return }

    const data = await readData(`schools/${schoolId}/students/`)
    const tableBody = document.getElementById('studentBody')
    tableBody.innerHTML = ''

    let i = 0;
    for (let stId of Object.keys(data)) {
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
