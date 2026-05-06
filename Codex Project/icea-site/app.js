const data = window.ICEA_DATA || { members: [], abolished: [] };
const collator = new Intl.Collator("zh-Hant");

const TEXT = {
  unspecified: "\u672a\u6a19\u793a",
  unlisted: "\u672a\u767b\u9304",
  frozen: "\u51cd\u7d50",
  safe: "\u5b89\u5168",
  lowRisk: "\u4f4e\u98a8\u96aa",
  noResults: "\u6c92\u6709\u7b26\u5408\u689d\u4ef6\u7684\u6703\u54e1\u570b\u3002",
  resultCount: (shown, total) => `\u986f\u793a ${shown} / ${total} \u7b46`,
  link: "\u9023\u7d50",
  hasRepresentative: "\u6709\u4ee3\u8868",
  noRepresentative: "\u7121\u4ee3\u8868",
  hasSeat: "\u6709\u5e2d\u4f4d",
  noSeat: "\u7121\u5e2d\u4f4d",
  meetingAria: (count) => `\u6703\u8b70\u53c3\u8207 ${count} \u5834`,
  joinedLabel: "\u5165\u806f\u65e5\u671f\uff1a",
  memberData: "\u6703\u54e1\u8cc7\u6599",
  activeSeats: "\u6709\u6548\u5e2d\u4f4d",
  representatives: "\u6709\u4ee3\u8868",
  externalLinks: "\u806f\u901a\u9023\u7d50",
  frozenStates: "\u51cd\u7d50\u72c0\u614b",
  archivedSeats: "\u5ee2\u9664\u5e2d\u4f4d",
  averageMeetings: "\u5e73\u5747\u6703\u8b70\u53c3\u8207",
  highestMeetings: "\u6700\u9ad8\u53c3\u8207\u6703\u8b70",
  sourceFallback: "ICEA Database",
};

const elements = {
  stats: document.querySelector("#stats-grid"),
  updatedAt: document.querySelector("#updated-at"),
  sourceName: document.querySelector("#source-name"),
  riskBars: document.querySelector("#risk-bars"),
  recentList: document.querySelector("#recent-list"),
  table: document.querySelector("#member-table"),
  resultCount: document.querySelector("#result-count"),
  statusFilter: document.querySelector("#status-filter"),
  seatFilter: document.querySelector("#seat-filter"),
  sortSelect: document.querySelector("#sort-select"),
  searchInput: document.querySelector("#search-input"),
  archiveGrid: document.querySelector("#archive-grid"),
};

const members = data.members.map((member) => ({
  ...member,
  searchText: [
    member.code,
    member.name,
    member.status,
    member.diplomaticActivity,
    member.governmentStability,
    member.riskLevel,
    member.customsReview,
    member.connectivity,
  ]
    .join(" ")
    .toLowerCase(),
}));

function normalizeStatus(status) {
  return status && status.trim() ? status : TEXT.unspecified;
}

function formatDate(date) {
  return date || TEXT.unlisted;
}

function countBy(items, selector) {
  return items.reduce((acc, item) => {
    const key = selector(item) || TEXT.unspecified;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function meetingCount(member) {
  return member.meetings.filter((meeting) => meeting.active).length;
}

function makeStatusClass(status) {
  if (!status) return "status empty";
  if (status.includes(TEXT.frozen)) return "status frozen";
  return "status";
}

function makeRiskClass(risk) {
  if (risk && risk.includes("\u9ad8")) return "tag high-risk";
  if (risk === TEXT.safe || risk === TEXT.lowRisk) return "tag safe";
  return "tag";
}

function renderStats() {
  const activeSeats = members.filter((member) => member.seat).length;
  const represented = members.filter((member) => member.representative).length;
  const linked = members.filter((member) => member.permalink).length;
  const frozen = members.filter((member) => normalizeStatus(member.status) === TEXT.frozen).length;
  const averageMeetings = (
    members.reduce((sum, member) => sum + meetingCount(member), 0) / Math.max(members.length, 1)
  ).toFixed(1);
  const highestMeetings = Math.max(...members.map(meetingCount), 0);

  const stats = [
    [TEXT.memberData, members.length],
    [TEXT.activeSeats, activeSeats],
    [TEXT.representatives, represented],
    [TEXT.externalLinks, linked],
    [TEXT.frozenStates, frozen],
    [TEXT.archivedSeats, data.abolished.length],
    [TEXT.averageMeetings, averageMeetings],
    [TEXT.highestMeetings, highestMeetings],
  ];

  elements.stats.innerHTML = stats
    .map(([label, value]) => `<article class="stat"><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderRiskBars() {
  const counts = Object.entries(countBy(members, (member) => member.riskLevel || TEXT.unspecified)).sort(
    (a, b) => b[1] - a[1]
  );
  const max = Math.max(...counts.map(([, count]) => count), 1);

  elements.riskBars.innerHTML = counts
    .map(([label, count]) => {
      const width = Math.max((count / max) * 100, 4);
      return `
        <div class="bar-row">
          <span>${label}</span>
          <span class="bar-track"><span class="bar-fill" style="width:${width}%"></span></span>
          <strong>${count}</strong>
        </div>
      `;
    })
    .join("");
}

function renderRecentList() {
  const recent = [...members]
    .filter((member) => member.joined)
    .sort((a, b) => b.joined.localeCompare(a.joined))
    .slice(0, 6);

  elements.recentList.innerHTML = recent
    .map(
      (member) => `
        <div class="recent-item">
          <div>
            <span class="code">${member.code}</span>
            <strong>${member.name}</strong>
          </div>
          <span class="muted">${member.joined}</span>
        </div>
      `
    )
    .join("");
}

function populateFilters() {
  const statuses = [...new Set(members.map((member) => normalizeStatus(member.status)))].sort(collator.compare);
  elements.statusFilter.insertAdjacentHTML(
    "beforeend",
    statuses.map((status) => `<option value="${status}">${status}</option>`).join("")
  );
}

function sortMembers(list) {
  const mode = elements.sortSelect.value;
  return [...list].sort((a, b) => {
    if (mode === "joined-asc") return (a.joined || "9999").localeCompare(b.joined || "9999");
    if (mode === "code-asc") return a.code.localeCompare(b.code);
    if (mode === "name-asc") return collator.compare(a.name, b.name);
    return (b.joined || "0000").localeCompare(a.joined || "0000");
  });
}

function getFilteredMembers() {
  const query = elements.searchInput.value.trim().toLowerCase();
  const status = elements.statusFilter.value;
  const seat = elements.seatFilter.value;

  return members.filter((member) => {
    const matchesQuery = !query || member.searchText.includes(query);
    const matchesStatus = status === "all" || normalizeStatus(member.status) === status;
    const matchesSeat = seat === "all" || (seat === "seat" ? member.seat : !member.seat);
    return matchesQuery && matchesStatus && matchesSeat;
  });
}

function renderTable() {
  const filtered = sortMembers(getFilteredMembers());
  elements.resultCount.textContent = TEXT.resultCount(filtered.length, members.length);

  if (!filtered.length) {
    elements.table.innerHTML = `<tr><td colspan="9" class="muted">${TEXT.noResults}</td></tr>`;
    return;
  }

  elements.table.innerHTML = filtered
    .map((member) => {
      const dots = member.meetings
        .map((meeting) => `<span class="dot${meeting.active ? " active" : ""}" title="${meeting.name}"></span>`)
        .join("");
      const link = member.permalink
        ? `<a class="external-link" href="${member.permalink}" target="_blank" rel="noreferrer">${TEXT.link}</a>`
        : `<span class="muted">${TEXT.unlisted}</span>`;
      const representativeLabel = member.representative ? TEXT.hasRepresentative : TEXT.noRepresentative;
      const seatLabel = member.seat ? TEXT.hasSeat : TEXT.noSeat;

      return `
        <tr>
          <td><span class="code">${member.code}</span></td>
          <td class="member-name">${member.name}<div class="muted">${representativeLabel} / ${seatLabel}</div></td>
          <td><span class="${makeStatusClass(member.status)}">${normalizeStatus(member.status)}</span></td>
          <td>${formatDate(member.joined)}</td>
          <td>${member.diplomaticActivity || TEXT.unspecified}</td>
          <td>${member.governmentStability || TEXT.unspecified}</td>
          <td><span class="${makeRiskClass(member.riskLevel)}">${member.riskLevel || TEXT.unspecified}</span></td>
          <td><div class="meeting-dots" aria-label="${TEXT.meetingAria(meetingCount(member))}">${dots}</div></td>
          <td>${member.connectivity || TEXT.unspecified}<div>${link}</div></td>
        </tr>
      `;
    })
    .join("");
}

function renderArchive() {
  elements.archiveGrid.innerHTML = data.abolished
    .map(
      (item) => `
        <article class="archive-card">
          <span class="code">${item.code}</span>
          <h3>${item.name}</h3>
          <p class="muted">${TEXT.joinedLabel}${formatDate(item.joined)}</p>
        </article>
      `
    )
    .join("");
}

function bindEvents() {
  [elements.searchInput, elements.statusFilter, elements.seatFilter, elements.sortSelect].forEach((control) => {
    control.addEventListener("input", renderTable);
    control.addEventListener("change", renderTable);
  });
}

function init() {
  elements.updatedAt.textContent = data.generatedAt || TEXT.unspecified;
  elements.sourceName.textContent = data.source || TEXT.sourceFallback;
  renderStats();
  renderRiskBars();
  renderRecentList();
  populateFilters();
  renderTable();
  renderArchive();
  bindEvents();
}

init();
