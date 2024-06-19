async function generateStudentTable() {
    const schoolId = document.getElementById('school').value

    if (!schoolId) 
        { failMessage("Please select school"); return }

    const data = await readData(`schools/${schoolId}/students/`)
    const tableBody = document.getElementById('studentBody')
    tableBody.innerHTML = ''

    let i = 0;
    for (let stId of Object.keys(data).slice(0, 100)) {
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
            <td><button class="btn btn-primary edit-stud-btn" data-school=${schoolId} data-admNo=${studentData['admNo']}>Edit</button></td>
        </tr>`
        tableBody.innerHTML += row
    }

    const btns = document.getElementsByClassName("edit-stud-btn");
    for (let btn of btns) {
        btn.addEventListener("click", async function (e) {
            const schoolId = e.target.getAttribute("data-school");
            const admNo = e.target.getAttribute("data-admNo");
            const docPath = `schools/${schoolId}/students/${admNo}`;
            const data = await readData(docPath);
            
            if (!data) {
                failMessage("No student found!");
                return;
            }

            const { name, gender, std, div } = data;
            document.getElementById('editStudSchool').value = schoolId;
            document.getElementById('oldAdmNo').value = admNo;
            document.getElementById('editStudAdmNo').value = admNo;
            document.getElementById('editStudStd').value = std;
            document.getElementById('editStudDiv').value = div;
            document.getElementById('editStudName').value = name;
            document.getElementById('editStudGender').value = gender;

            document.getElementById('openEditStudModal').click();
        })
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

const addStudentForm = document.getElementById("addStudentForm");
addStudentForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    processingMessage("Adding student");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const { schoolId, admNo, std, div, name, gender } = data;
    if (!schoolId?.trim() || 
        !admNo?.trim() ||
        !std?.trim() ||
        !div?.trim() ||
        !name?.trim() ||
        !gender?.trim()) {
        failMessage("Please provide all details!");
        return;
    }

    const dbPath = `schools/${schoolId}/students/${admNo}`;

    try {
        const studentExists = await readData(dbPath);
        if (studentExists) {
            failMessage(`Student with admission no. ${admNo} already exists!`);
            return;
        }

        const reConfirm = confirm("Are you sure?");
        if (!reConfirm)
            return;

        const isAdded = await writeData(dbPath, {
            admNo,
            std,
            div, 
            name,
            gender,
        });

        if (!isAdded) {
            failMessage("Couldn't add student!");
            return;
        }

        successMessage("Added student successfully!");
        document.getElementById('closeAddStudModal').click();

    } catch (error) {
        console.log(error);
        failMessage("Couldn't add student!");
        return;
    }

})

const editStudentForm = document.getElementById("editStudentForm");
editStudentForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    processingMessage("Editing student");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    const schoolId = document.getElementById('editStudSchool').value;
    const { admNo, std, div, name, gender } = data;
    if (!schoolId?.trim() || 
        !admNo?.trim() ||
        !std?.trim() ||
        !div?.trim() ||
        !name?.trim() ||
        !gender?.trim()) {
        failMessage("Please provide all details!");
        return;
    }
    
    const reConfirm = confirm("Are you sure?");
    if (!reConfirm)
        return;

    const dbPath = `schools/${schoolId}/students/${admNo}`;

    try {
        const isAdded = await writeData(dbPath, {
            admNo,
            std,
            div, 
            name,
            gender,
        });

        if (!isAdded) {
            failMessage("Couldn't edit student!");
            return;
        }

        successMessage("Student details edited successfully!");
        document.getElementById('closeEditStudModal').click();

    } catch (error) {
        console.log(error);
        failMessage("Couldn't add student!");
        return;
    }

})
