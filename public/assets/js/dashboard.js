// Initialize charts when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Line chart
    const salesCtx = document.getElementById("salesChart").getContext("2d");
    const salesChart = new Chart(salesCtx, {
        type: "line",
        data: {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            datasets: [
                {
                    label: "Sales",
                    data: [65, 59, 80, 81, 56, 55, 40, 58, 75, 85, 90, 100],
                    backgroundColor: "rgba(58, 134, 255, 0.2)",
                    borderColor: "#3a86ff",
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 3,
                    fill: true,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });

    // Bar chart
    const visitorsCtx = document
        .getElementById("visitorsChart")
        .getContext("2d");
    const visitorsChart = new Chart(visitorsCtx, {
        type: "bar",
        data: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Visitors",
                    data: [1200, 1900, 1500, 2000, 1800, 1400, 1700],
                    backgroundColor: "#3a86ff",
                    borderRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });

    // Pie chart
    const salesDistributionCtx = document
        .getElementById("salesDistributionChart")
        .getContext("2d");
    const salesDistributionChart = new Chart(salesDistributionCtx, {
        type: "doughnut",
        data: {
            labels: ["Electronics", "Clothing", "Food", "Books"],
            datasets: [
                {
                    data: [40, 20, 25, 15],
                    backgroundColor: [
                        "#3a86ff",
                        "#ff006e",
                        "#fb5607",
                        "#8338ec",
                    ],
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
        },
    });

    // Area chart
    const revenueCtx = document.getElementById("revenueChart").getContext("2d");
    const revenueChart = new Chart(revenueCtx, {
        type: "line",
        data: {
            labels: [
                "Q1 2022",
                "Q2 2022",
                "Q3 2022",
                "Q4 2022",
                "Q1 2023",
                "Q2 2023",
            ],
            datasets: [
                {
                    label: "Actual",
                    data: [18500, 21500, 25600, 28900, 31400, 36200],
                    borderColor: "#3a86ff",
                    backgroundColor: "rgba(58, 134, 255, 0.1)",
                    borderWidth: 2,
                    fill: true,
                },
                {
                    label: "Projected",
                    data: [19000, 22000, 27000, 30000, 35000, 40000],
                    borderColor: "#ff006e",
                    backgroundColor: "transparent",
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                },
            },
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: "rgba(0, 0, 0, 0.05)",
                    },
                },
                x: {
                    grid: {
                        display: false,
                    },
                },
            },
        },
    });
});