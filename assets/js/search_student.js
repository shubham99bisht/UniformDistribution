const searchForm = document.getElementById('searchStudentForm');
searchForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  document.getElementById('updateStudBtn').disabled = true;

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());
  const { schoolId, admNo } = data;

    if (!schoolId?.trim() || !admNo?.trim()) {
        failMessage("Please fill all the details");
        return;
    }

  const docPath = `schools/${schoolId}/students/${admNo}`;

  try {
    const data = await readData(docPath);
    if (!data) {
      failMessage('No student found!');
      document.getElementById('studentDetailForm').reset();
      return;
    }

    const { name, gender, std, div } = data;
    
    // Set form data
    document.getElementById('schoolId').value = schoolId;
    document.getElementById('admNo').value = admNo;
    document.getElementById('name').value = name;
    document.getElementById('std').value = std;
    document.getElementById('div').value = div;
    document.getElementById('gender').value = gender;

    document.getElementById('updateStudBtn').disabled = false;
  } catch (error) {
    failMessage('Failed to fetch student record!');
    document.getElementById('studentDetailForm').reset();
    return;
  }
});

const studentDetailForm = document.getElementById('studentDetailForm');
studentDetailForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  processingMessage('Updating student details...');

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  const schoolId = document.getElementById('schoolId').value;
  const { admNo, std, div, name, gender } = data;
  if (
    !schoolId?.trim() ||
    !admNo?.trim() ||
    !std?.trim() ||
    !div?.trim() ||
    !name?.trim() ||
    !gender?.trim()
  ) {
    failMessage('Please provide all details!');
    return;
  }

  const reConfirm = confirm('Are you sure?');
  if (!reConfirm) return;

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

    successMessage('Student details updated successfully!');
  } catch (error) {
    console.log(error);
    failMessage("Failed to update student details!");
    return;
  }
});
