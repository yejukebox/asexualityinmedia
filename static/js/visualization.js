// Load and visualize character data
let allCharacters = [];
let filteredCharacters = [];

// Dimensions and margins
const margin = { top: 40, right: 40, bottom: 60, left: 60 };
const width = Math.min(1200, window.innerWidth - 40) - margin.left - margin.right;
const height = Math.min(700, window.innerHeight - 300) - margin.top - margin.bottom;

// Create SVG
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load data
d3.json("/asexualityinmedia/data/characters.json").then(data => {
    allCharacters = data;
    filteredCharacters = data;

    // Populate filter dropdowns
    populateFilters(data);

    // Initial render
    updateVisualization();
    updateCounts();
});

function populateFilters(data) {
    // Get unique values
    const genres = [...new Set(data.map(d => d.genre))].sort();
    const languages = [...new Set(data.map(d => d.language))].sort();

    // Populate genre filter
    const genreSelect = d3.select("#genre-filter");
    genres.forEach(genre => {
        genreSelect.append("option").attr("value", genre).text(genre);
    });

    // Populate language filter
    const languageSelect = d3.select("#language-filter");
    languages.forEach(language => {
        languageSelect.append("option").attr("value", language).text(language);
    });

    // Add event listeners
    d3.select("#genre-filter").on("change", applyFilters);
    d3.select("#language-filter").on("change", applyFilters);
    d3.select("#type-filter").on("change", applyFilters);
    d3.select("#search").on("input", applyFilters);
}

function applyFilters() {
    const genreFilter = d3.select("#genre-filter").property("value");
    const languageFilter = d3.select("#language-filter").property("value");
    const typeFilter = d3.select("#type-filter").property("value");
    const searchTerm = d3.select("#search").property("value").toLowerCase();

    filteredCharacters = allCharacters.filter(char => {
        const matchesGenre = genreFilter === "all" || char.genre === genreFilter;
        const matchesLanguage = languageFilter === "all" || char.language === languageFilter;
        const matchesType = typeFilter === "all" || char.type === typeFilter;
        const matchesSearch = searchTerm === "" ||
            char.fullName.toLowerCase().includes(searchTerm) ||
            char.title.toLowerCase().includes(searchTerm) ||
            (char.nickname && char.nickname.toLowerCase().includes(searchTerm));

        return matchesGenre && matchesLanguage && matchesType && matchesSearch;
    });

    updateVisualization();
    updateCounts();
}

function updateVisualization() {
    // Clear previous visualization
    svg.selectAll("*").remove();

    if (filteredCharacters.length === 0) {
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("class", "no-results")
            .text("No characters match your filters");
        return;
    }

    // Create scales
    const xScale = d3.scaleLinear()
        .domain([d3.min(filteredCharacters, d => d.year) - 1, d3.max(filteredCharacters, d => d.year) + 1])
        .range([0, width]);

    // For y-axis, use genre categories
    const genres = [...new Set(filteredCharacters.map(d => d.genre))].sort();
    const yScale = d3.scalePoint()
        .domain(genres)
        .range([height, 0])
        .padding(0.5);

    // Add jitter to prevent overlapping
    const jitter = 20;

    // Color scale
    const colorScale = d3.scaleOrdinal()
        .domain(["explicit", "implicit"])
        .range(["#800080", "#a0a0a0"]);

    // Add axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis)
        .append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Year");

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -45)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .text("Genre");

    // Add dots
    const dots = svg.selectAll(".dot")
        .data(filteredCharacters)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.year) + (Math.random() - 0.5) * jitter)
        .attr("cy", d => yScale(d.genre) + (Math.random() - 0.5) * jitter)
        .attr("r", 8)
        .attr("fill", d => colorScale(d.type))
        .attr("stroke", "#fff")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 12)
                .attr("stroke-width", 3);

            tooltip.transition()
                .duration(200)
                .style("opacity", 1);

            tooltip.html(`
                <strong>${d.fullName}</strong>${d.nickname && d.nickname !== d.fullName ? ` (${d.nickname})` : ''}<br/>
                <em>${d.title}</em><br/>
                ${d.genre} • ${d.year} • ${d.rating}<br/>
                Language: ${d.language}<br/>
                Type: <strong>${d.type.charAt(0).toUpperCase() + d.type.slice(1)}</strong>
            `)
                .style("left", (event.pageX + 15) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 8)
                .attr("stroke-width", 2);

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .on("click", function(event, d) {
            window.location.href = `/asexualityinmedia/characters/${d.id}/`;
        });

    // Add animation
    dots.style("opacity", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 50)
        .style("opacity", 1);
}

function updateCounts() {
    d3.select("#total-count").text(allCharacters.length);
    d3.select("#visible-count").text(filteredCharacters.length);
}

// Handle window resize
window.addEventListener("resize", () => {
    // Redraw visualization on window resize
    const newWidth = Math.min(1200, window.innerWidth - 40) - margin.left - margin.right;
    const newHeight = Math.min(700, window.innerHeight - 300) - margin.top - margin.bottom;

    if (Math.abs(newWidth - width) > 50 || Math.abs(newHeight - height) > 50) {
        location.reload();
    }
});
