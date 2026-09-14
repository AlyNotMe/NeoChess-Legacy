const canvas = document.getElementById("eloChart");
if (canvas) {
  const history = JSON.parse(canvas.dataset.eloHistory || "[]");
  const monthLabel = new Intl.DateTimeFormat("fr-FR", { month: "short" });

  new Chart(canvas, {
    type: "line",
    data: {
      labels: history.map((point) => monthLabel.format(new Date(point.createdAt))),
      datasets: [
        {
          data: history.map((point) => point.elo),
          borderColor: "#c9963a",
          backgroundColor: "rgba(201, 150, 58, 0.2)",
          fill: true,
          tension: 0.35,
          pointRadius: 3.5,
          pointBackgroundColor: "#c9963a",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: "rgba(255,255,255,0.4)" } },
        y: { display: false },
      },
    },
  });
}
