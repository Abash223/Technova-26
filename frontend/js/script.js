document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("registrationForm");

    const participationType =
        document.getElementById("participationType");

    const teamNameGroup =
        document.getElementById("teamNameGroup");

    const teamMembersGroup =
        document.getElementById("teamMembersGroup");

    const teamName =
        document.getElementById("teamName");

    const message =
        document.getElementById("message");

    const submitBtn =
        document.getElementById("submitBtn");


    // Check required elements
    if (!form) {
        console.error(
            "ERROR: registrationForm not found"
        );
        return;
    }

    if (!participationType) {
        console.error(
            "ERROR: participationType not found"
        );
        return;
    }


    // ========================================
    // TEAM SELECTION
    // ========================================

    participationType.addEventListener(
        "change",
        function () {

            if (this.value === "Team") {

                teamNameGroup
                    .classList
                    .remove("hidden");

                teamMembersGroup
                    .classList
                    .remove("hidden");

                teamName.required = true;

            } else {

                teamNameGroup
                    .classList
                    .add("hidden");

                teamMembersGroup
                    .classList
                    .add("hidden");

                teamName.required = false;

                teamName.value = "";

            }

        }
    );


    // ========================================
    // FORM SUBMISSION
    // ========================================

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // Clear previous message

            message.textContent = "";

            message.className = "message";


            // Disable button

            submitBtn.disabled = true;

            submitBtn.textContent =
                "Submitting Registration...";


            // Create FormData

            const formData =
                new FormData(form);


            try {

                // Send data to Express backend

                const response =
                    await fetch(
                        "/api/register",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                // Check response

                if (!response.ok) {

                    throw new Error(
                        `Server error: ${response.status}`
                    );

                }


                // Convert response to JSON

                const data =
                    await response.json();


                // Successful registration

                if (data.success) {

                    message.classList
                        .add("success");

                    message.innerHTML = `
                        Registration Successful!<br>
                        Your Registration Number is:
                        <strong>
                            ${data.registrationNumber}
                        </strong>
                    `;


                    // Reset form

                    form.reset();


                    // Hide team fields

                    teamNameGroup
                        .classList
                        .add("hidden");

                    teamMembersGroup
                        .classList
                        .add("hidden");


                } else {

                    throw new Error(
                        data.message ||
                        "Registration failed."
                    );

                }


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );


                message.classList
                    .add("error");


                message.textContent =
                    error.message ||
                    "Something went wrong. Please try again.";


            } finally {

                submitBtn.disabled =
                    false;

                submitBtn.textContent =
                    "Submit Registration";

            }

        }
    );

});