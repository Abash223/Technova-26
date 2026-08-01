// ========================================
// TECHNOVA ADMIN DASHBOARD
// ========================================

let registrations = [];


// ========================================
// DOM ELEMENTS
// ========================================

const totalRegistrations =
    document.getElementById(
        "totalRegistrations"
    );

const individualCount =
    document.getElementById(
        "individualCount"
    );

const teamCount =
    document.getElementById(
        "teamCount"
    );

const eventCount =
    document.getElementById(
        "eventCount"
    );

const individualPercentage =
    document.getElementById(
        "individualPercentage"
    );

const teamPercentage =
    document.getElementById(
        "teamPercentage"
    );

const individualProgress =
    document.getElementById(
        "individualProgress"
    );

const teamProgress =
    document.getElementById(
        "teamProgress"
    );

const registrationTable =
    document.getElementById(
        "registrationTable"
    );

const eventSummary =
    document.getElementById(
        "eventSummary"
    );

const eventCards =
    document.getElementById(
        "eventCards"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const eventFilter =
    document.getElementById(
        "eventFilter"
    );

const typeFilter =
    document.getElementById(
        "typeFilter"
    );

const refreshBtn =
    document.getElementById(
        "refreshBtn"
    );

const exportBtn =
    document.getElementById(
        "exportBtn"
    );

const emptyState =
    document.getElementById(
        "emptyState"
    );

const detailsModal =
    document.getElementById(
        "detailsModal"
    );

const closeModal =
    document.getElementById(
        "closeModal"
    );

const registrationDetails =
    document.getElementById(
        "registrationDetails"
    );


// ========================================
// LOAD REGISTRATIONS
// ========================================

async function loadRegistrations() {

    try {

        refreshBtn.textContent =
            "Loading...";

        refreshBtn.disabled = true;


        const response =
            await fetch(
                "/api/registrations"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load registrations"
            );

        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                "Failed to load registrations"
            );

        }


        registrations =
            data.registrations || [];


        updateDashboard();

        populateEventFilter();

        renderTable(
            registrations
        );


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );


        registrationTable.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    class="loading"
                >

                    ❌ Failed to load registrations.

                    <br><br>

                    ${escapeHtml(
                        error.message
                    )}

                </td>

            </tr>

        `;

    } finally {

        refreshBtn.textContent =
            "↻ Refresh";

        refreshBtn.disabled =
            false;

    }

}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    const total =
        registrations.length;


    const individual =
        registrations.filter(
            registration =>
                registration.participation_type ===
                "Individual"
        ).length;


    const team =
        registrations.filter(
            registration =>
                registration.participation_type ===
                "Team"
        ).length;


    const events =
        getEventCounts();


    totalRegistrations.textContent =
        total;


    individualCount.textContent =
        individual;


    teamCount.textContent =
        team;


    eventCount.textContent =
        Object.keys(events).length;


    const individualPercent =
        total > 0
            ? Math.round(
                individual / total * 100
            )
            : 0;


    const teamPercent =
        total > 0
            ? Math.round(
                team / total * 100
            )
            : 0;


    individualPercentage.textContent =
        `${individualPercent}%`;


    teamPercentage.textContent =
        `${teamPercent}%`;


    individualProgress.style.width =
        `${individualPercent}%`;


    teamProgress.style.width =
        `${teamPercent}%`;


    renderEventSummary(
        events
    );


    renderEventCards(
        events
    );

}


// ========================================
// EVENT COUNTS
// ========================================

function getEventCounts() {

    const counts = {};


    registrations.forEach(
        registration => {

            const event =
                registration.event_name ||
                "Unknown Event";


            if (!counts[event]) {

                counts[event] = 0;

            }


            counts[event]++;

        }
    );


    return counts;

}


// ========================================
// EVENT SUMMARY
// ========================================

function renderEventSummary(
    events
) {

    const eventNames =
        Object.keys(events);


    if (
        eventNames.length === 0
    ) {

        eventSummary.innerHTML = `

            <div class="loading">

                No registrations yet.

            </div>

        `;

        return;

    }


    const max =
        Math.max(
            ...Object.values(events)
        );


    eventSummary.innerHTML =
        eventNames
            .sort(
                (a, b) =>
                    events[b] -
                    events[a]
            )
            .map(
                event => {

                    const percentage =
                        max > 0
                            ? (
                                events[event] /
                                max
                            ) * 100
                            : 0;


                    return `

                        <div
                            class="event-row"
                        >

                            <div
                                class="event-title"
                            >

                                <span>
                                    ${escapeHtml(event)}
                                </span>

                                <span>
                                    ${events[event]}
                                </span>

                            </div>

                            <div
                                class="event-progress"
                            >

                                <div
                                    class="event-progress-bar"
                                    style="width:${percentage}%"
                                ></div>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}


// ========================================
// EVENT CARDS
// ========================================

function renderEventCards(
    events
) {

    const eventNames =
        Object.keys(events);


    if (
        eventNames.length === 0
    ) {

        eventCards.innerHTML = `

            <div class="loading">
                No events available.
            </div>

        `;

        return;

    }


    eventCards.innerHTML =
        eventNames
            .sort(
                (a, b) =>
                    events[b] -
                    events[a]
            )
            .map(
                event => `

                    <div
                        class="event-card"
                    >

                        <h3>
                            ${escapeHtml(event)}
                        </h3>

                        <strong>
                            ${events[event]}
                        </strong>

                        <span>
                            Registrations
                        </span>

                    </div>

                `
            )
            .join("");

}


// ========================================
// EVENT FILTER
// ========================================

function populateEventFilter() {

    const currentValue =
        eventFilter.value;


    const events =
        Object.keys(
            getEventCounts()
        ).sort();


    eventFilter.innerHTML = `

        <option value="">
            All Events
        </option>

    `;


    events.forEach(
        event => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                event;


            option.textContent =
                event;


            eventFilter.appendChild(
                option
            );

        }
    );


    eventFilter.value =
        currentValue;

}


// ========================================
// FILTER REGISTRATIONS
// ========================================

function filterRegistrations() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const selectedEvent =
        eventFilter.value;


    const selectedType =
        typeFilter.value;


    const filtered =
        registrations.filter(
            registration => {

                const searchableText = [

                    registration.registration_number,

                    registration.full_name,

                    registration.email,

                    registration.phone,

                    registration.college_name,

                    registration.event_name,

                    registration.transaction_id

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                const matchesEvent =
                    !selectedEvent ||
                    registration.event_name ===
                    selectedEvent;


                const matchesType =
                    !selectedType ||
                    registration.participation_type ===
                    selectedType;


                return (
                    matchesSearch &&
                    matchesEvent &&
                    matchesType
                );

            }
        );


    renderTable(
        filtered
    );

}


// ========================================
// RENDER TABLE
// ========================================

function renderTable(
    data
) {

    if (
        data.length === 0
    ) {

        registrationTable.innerHTML =
            "";

        emptyState.classList.remove(
            "hidden"
        );

        return;

    }


    emptyState.classList.add(
        "hidden"
    );


    registrationTable.innerHTML =
        data.map(
            registration => {

                const typeClass =
                    registration.participation_type ===
                    "Team"
                        ? "type-team"
                        : "type-individual";


                const createdDate =
                    registration.created_at
                        ? new Date(
                            registration.created_at
                        ).toLocaleDateString()
                        : "-";


                return `

                    <tr>

                        <td>

                            <span
                                class="registration-number"
                            >
                                ${escapeHtml(
                                    registration.registration_number
                                )}
                            </span>

                        </td>


                        <td>

                            <div
                                class="participant-name"
                            >
                                ${escapeHtml(
                                    registration.full_name
                                )}
                            </div>

                            <div
                                class="participant-email"
                            >
                                ${escapeHtml(
                                    registration.email
                                )}
                            </div>

                        </td>


                        <td>

                            ${escapeHtml(
                                registration.phone ||
                                "-"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                registration.college_name ||
                                "-"
                            )}

                        </td>


                        <td>

                            ${escapeHtml(
                                registration.event_name ||
                                "-"
                            )}

                        </td>


                        <td>

                            <span
                                class="type-badge ${typeClass}"
                            >

                                ${escapeHtml(
                                    registration.participation_type ||
                                    "-"
                                )}

                            </span>

                        </td>


                        <td>

                            ${escapeHtml(
                                registration.transaction_id ||
                                "-"
                            )}

                        </td>


                        <td>

                            ${createdDate}

                        </td>


                        <td>

                            <button
                                class="view-btn"
                                onclick="showDetails('${escapeJs(
                                    registration.registration_number
                                )}')"
                            >
                                View
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


// ========================================
// VIEW DETAILS
// ========================================

function showDetails(
    registrationNumber
) {

    const registration =
        registrations.find(
            item =>
                item.registration_number ===
                registrationNumber
        );


    if (!registration) {

        return;

    }


    const paymentScreenshot =
        registration.payment_screenshot;


    let paymentHTML =
        "Not uploaded";


    if (paymentScreenshot) {

        paymentHTML = `

            <a
                href="/uploads/${encodeURIComponent(
                    paymentScreenshot
                )}"
                target="_blank"
            >
                View Payment Screenshot
            </a>

        `;

    }


    registrationDetails.innerHTML = `

        <div
            class="detail-grid"
        >

            ${detail(
                "Registration Number",
                registration.registration_number
            )}

            ${detail(
                "Full Name",
                registration.full_name
            )}

            ${detail(
                "Email",
                registration.email
            )}

            ${detail(
                "Phone",
                registration.phone
            )}

            ${detail(
                "College",
                registration.college_name
            )}

            ${detail(
                "Department",
                registration.department
            )}

            ${detail(
                "Year",
                registration.year_of_study
            )}

            ${detail(
                "Event",
                registration.event_name
            )}

            ${detail(
                "Participation",
                registration.participation_type
            )}

            ${detail(
                "Team Name",
                registration.team_name ||
                "N/A"
            )}

            ${detail(
                "Team Members",
                registration.team_members ||
                "N/A"
            )}

            ${detail(
                "Transaction ID",
                registration.transaction_id
            )}

            ${detail(
                "Registration Fee",
                registration.registration_fee
                    ? `₹${registration.registration_fee}`
                    : "N/A"
            )}

            <div
                class="detail-item"
            >

                <span>
                    Payment Screenshot
                </span>

                <strong>
                    ${paymentHTML}
                </strong>

            </div>

        </div>

    `;


    detailsModal.classList.remove(
        "hidden"
    );

}


// ========================================
// DETAIL HELPER
// ========================================

function detail(
    label,
    value
) {

    return `

        <div
            class="detail-item"
        >

            <span>
                ${escapeHtml(label)}
            </span>

            <strong>
                ${escapeHtml(
                    value ?? "-"
                )}
            </strong>

        </div>

    `;

}


// ========================================
// CSV EXPORT
// ========================================

function exportCSV() {

    if (
        registrations.length === 0
    ) {

        alert(
            "There are no registrations to export."
        );

        return;

    }


    const headers = [

        "Registration Number",

        "Full Name",

        "Email",

        "Phone",

        "College",

        "Department",

        "Year",

        "Event",

        "Participation Type",

        "Team Name",

        "Team Members",

        "Transaction ID",

        "Registration Fee",

        "Created At"

    ];


    const rows =
        registrations.map(
            registration => [

                registration.registration_number,

                registration.full_name,

                registration.email,

                registration.phone,

                registration.college_name,

                registration.department,

                registration.year_of_study,

                registration.event_name,

                registration.participation_type,

                registration.team_name,

                registration.team_members,

                registration.transaction_id,

                registration.registration_fee,

                registration.created_at

            ]
        );


    const csv = [

        headers,

        ...rows

    ]
        .map(
            row =>
                row.map(
                    value =>
                        `"${String(
                            value ?? ""
                        ).replace(
                            /"/g,
                            '""'
                        )}"`
                ).join(",")
        )
        .join("\n");


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        `technova-registrations-${new Date()
            .toISOString()
            .slice(0, 10)}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


// ========================================
// SECURITY HELPERS
// ========================================

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeJs(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        );

}


// ========================================
// EVENTS
// ========================================

searchInput.addEventListener(
    "input",
    filterRegistrations
);


eventFilter.addEventListener(
    "change",
    filterRegistrations
);


typeFilter.addEventListener(
    "change",
    filterRegistrations
);


refreshBtn.addEventListener(
    "click",
    loadRegistrations
);


exportBtn.addEventListener(
    "click",
    exportCSV
);


closeModal.addEventListener(
    "click",
    () => {

        detailsModal.classList.add(
            "hidden"
        );

    }
);


detailsModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            detailsModal
        ) {

            detailsModal.classList.add(
                "hidden"
            );

        }

    }
);


// ========================================
// INITIAL LOAD
// ========================================

loadRegistrations();