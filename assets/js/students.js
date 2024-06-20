let allStudentsData;

function getPageParams() {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page'));
    const schoolId = searchParams.get('schoolId');

    return { page, schoolId };
}

window.addEventListener("load", async function() {
    let { page, schoolId } = getPageParams();

    if (page && !schoolId) {
        location.href = 'students.html';
        return;
    }
    
    if (!page) page = 1;
    if (schoolId && schoolId != 1 && schoolId != 2) {
        alert("Invalid school id");
        location.href = 'students.html';
        return;
    }

    if (schoolId) {
        document.getElementById("school").value = schoolId;
        const startIdx = (page - 1) * 100;
        await generateStudentTable(startIdx);
    }
})

document.getElementById('prevBtn').addEventListener('click', function () {
    const { page } = getPageParams();
    const schoolId = document.getElementById("school").value;

    if (page > 1 && schoolId)  {
        location.href = `students.html?schoolId=${schoolId}&page=${page - 1}`
    }
})

document.getElementById('nextBtn').addEventListener('click', function () {
    let { page } = getPageParams();
    if (!page) page = 1;

    const schoolId = document.getElementById("school").value;

    if (schoolId)  {
        location.href = `students.html?schoolId=${schoolId}&page=${page + 1}`
    }
})

async function generateStudentTable(startIdx=0) {
    const schoolId = document.getElementById('school').value

    if (!schoolId) 
        { failMessage("Please select school"); return }

    allStudentsData = await readData(`schools/${schoolId}/students/`)
    const curatedData = Object.keys(allStudentsData).slice(startIdx, startIdx + 100)

    const tableBody = document.getElementById('studentBody')
    tableBody.innerHTML = ''
    
    if (!curatedData?.length) {
        tableBody.innerHTML = '<h4 class="p-4">No students found!</h4>';
        return;
    }

    let i = startIdx;
    for (let stId of curatedData) {
        i += 1;
        let studentData = allStudentsData[stId];

        const row = `<tr>
            <td>${i}</td>
            <td>${studentData['admNo']}</td>
            <td>${studentData['name']}</td>
            <td>${studentData['std']}</td>
            <td>${studentData['div']}</td>
            <td>${studentData['gender'] === 'M' ? 'Male': 'Female'}</td>
            <td><button class="btn btn-primary edit-stud-btn" data-school=${schoolId} data-admNo=${studentData['admNo']}>Edit</button></td>
        </tr>`
        tableBody.innerHTML += row
    }

    addEditButtonsEventListener();
}

function addEditButtonsEventListener() {
  const editButtons = document.getElementsByClassName('edit-stud-btn');
  for (let button of editButtons) {
    button.addEventListener('click', async function (e) {
      const schoolId = e.target.getAttribute('data-school');
      const admNo = e.target.getAttribute('data-admNo');

      const docPath = `schools/${schoolId}/students/${admNo}`;
      const data = await readData(docPath);

      if (!data) {
        failMessage('No student found!');
        return;
      }

      const { name, gender, std, div } = data;

      // Set Modal Data
      document.getElementById('editStudSchool').value = schoolId;
      document.getElementById('editStudAdmNo').value = admNo;
      document.getElementById('editStudStd').value = std;
      document.getElementById('editStudDiv').value = div;
      document.getElementById('editStudName').value = name;
      document.getElementById('editStudGender').value = gender;

      document.getElementById('openEditStudModal').click();
    });
  }
}

function exportTableToCSV(filename) {
    if (!allStudentsData) {
        failMessage("No data found!");
        return;
    }

    const csv = [
      ['S. No.', 'Admission No.', 'Name', 'Standard', 'Division', 'Gender'],
    ];

    let i = 1;
    for (let key in allStudentsData) {
      const student = allStudentsData[key];
      if (student) {
        const { admNo, name, std, div } = student;
        const gender = student['gender'] === 'M' ? 'Male' : 'Female';
        csv.push([i, admNo, name, std, div, gender].join(','));
        i++;
      }
    }

    if (csv.length === 1) {
        failMessage("No data found!");
        return;
    }

    // Download CSV file
    const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
    const downloadLink = document.createElement("a");
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

    processingMessage("Adding student...");

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

    const dbPath = `schools/${schoolId}/students/${admNo}/`;

    try {
        const studentExists = await readData(dbPath);
        if (studentExists) {
            failMessage(`Student with admission no. ${admNo} already exists!`);
            return;
        }

        const reConfirm = confirm("Are you sure?");
        if (!reConfirm) {
            closeSwal();
            return;
        }

        const isAdded = await writeData(dbPath, {
            admNo,
            std,
            div, 
            name,
            gender,
        });

        if (!isAdded) {
            failMessage("Failed to add student!");
            return;
        }

        successMessage("Student added successfully!");
        document.getElementById('closeAddStudModal').click();

        const page = getPageParams()?.page || 1;
        const startIdx = (page - 1) * 100;
        await generateStudentTable(startIdx);

    } catch (error) {
        console.log(error);
        failMessage("Failed to add student!");
        return;
    }

})

const editStudentForm = document.getElementById("editStudentForm");
editStudentForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    processingMessage("Updating details...");

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
    if (!reConfirm) {
        closeSwal();
        return;
    }

    const dbPath = `schools/${schoolId}/students/${admNo}`;

    try {
        const isUpdated = await writeData(dbPath, {
            admNo,
            std,
            div, 
            name,
            gender,
        });

        if (!isUpdated) {
            failMessage("Failed to update student details!");
            return;
        }

        successMessage("Student details updated successfully!");
        document.getElementById('closeEditStudModal').click();
        
        const page = getPageParams()?.page || 1;
        const startIdx = (page - 1) * 100;
        await generateStudentTable(startIdx);
    } catch (error) {
        console.log(error);
        failMessage("Failed to update student details!");
        return;
    }
})
