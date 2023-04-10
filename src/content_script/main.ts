const CLASS_RED = "kiddy-red";
const BASE_WORK_TIME = 8;

const getTargetWorkTime = (): number | null => {
  const targetWorkTimeTd = document.querySelector(
    "td.htBlock-normalTable_splitter"
  );
  return targetWorkTimeTd?.textContent
    ? parseFloat(targetWorkTimeTd.textContent)
    : null;
};

const getAllWorkTime = (): number | null => {
  const allWorkTimeTd = document.querySelector("td.all_work_time");
  return allWorkTimeTd?.textContent
    ? parseFloat(allWorkTimeTd.textContent)
    : null;
};

const getTbody = (): HTMLTableSectionElement | null => {
  return document.querySelector(
    "div.htBlock-adjastableTableF_inner > table > tbody"
  );
};

const trimmedString = (s: string | null | undefined): string => {
  return s?.replace(/(\r\n|\n|\r)/gm, "") || "";
};

const isWorkday = (scheduleName: string): boolean => {
  return scheduleName.includes("Flex");
};

const isHoliday = (scheduleName: string): boolean => {
  return !isWorkday(scheduleName) && trimmedString(scheduleName) !== "--";
};

const main = (): void => {
  const targetWorkTime = getTargetWorkTime();
  const allWorkTime = getAllWorkTime();
  if (targetWorkTime === null || allWorkTime === null) return;

  let totalRemainTime = targetWorkTime - allWorkTime;
  if (totalRemainTime <= 0) return;

  const tbody = getTbody();
  if (!tbody) return;

  let remainingWorkdayCnt = 0;
  let holidayCnt = 0;
  for (let tr of tbody.children) {
    const scheduleTd = tr.querySelector(
      "td.schedule.specific-timecard_schedule"
    );
    const workTimeTd = tr.querySelector("td.all_work_time");
    const scheduleName = trimmedString(scheduleTd?.textContent);
    if (
      isWorkday(scheduleName) &&
      trimmedString(workTimeTd?.textContent) === ""
    ) {
      remainingWorkdayCnt++;
    } else if (isHoliday(scheduleName)) {
      holidayCnt++;
    }
  }

  if (remainingWorkdayCnt === 0) return;

  totalRemainTime -= holidayCnt * BASE_WORK_TIME;
  if (totalRemainTime <= 0) return;

  const allWorkTimeTd = document.querySelector("td.all_work_time");
  const totalRemainSpan = document.createElement("span");
  totalRemainSpan.textContent = `（残り: ${totalRemainTime.toFixed(2)}）`;
  totalRemainSpan.className = CLASS_RED;
  allWorkTimeTd?.append(totalRemainSpan);

  const remainTime = totalRemainTime / remainingWorkdayCnt;
  for (let tr of tbody.children) {
    const scheduleTd = tr.querySelector(
      "td.schedule.specific-timecard_schedule"
    );
    if (isWorkday(trimmedString(scheduleTd?.textContent))) {
      const workTimeTd = tr.querySelector("td.all_work_time");
      if (trimmedString(workTimeTd?.textContent) !== "") continue;

      const firstElementChild = workTimeTd?.firstElementChild;
      if (firstElementChild) {
        firstElementChild.textContent = remainTime.toFixed(2);
        firstElementChild.className = CLASS_RED;
      }
    }
  }
};

export { main, trimmedString, isWorkday, isHoliday };
