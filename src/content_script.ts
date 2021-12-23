const Main = (): void => {
  const classes = {
    red: "kiddy-red",
  };

  const baseWorkTime = 8;

  const targetWorkTimeTd = document.querySelector(
    "td.htBlock-normalTable_splitter"
  );
  const allWorkTimeTd = document.querySelector("td.all_work_time");
  const targetWorkTime = targetWorkTimeTd?.textContent;
  const allWorkTime = allWorkTimeTd?.textContent;
  if (!targetWorkTime || !allWorkTime) return;

  let totalRemainTime = parseFloat(targetWorkTime) - parseFloat(allWorkTime);
  if (totalRemainTime <= 0) return;

  const tbody = document.querySelector(
    "div.htBlock-adjastableTableF_inner > table > tbody"
  );
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
    )
      remainingWorkdayCnt++;
    else if (isHoliday(scheduleName)) holidayCnt++;
  }

  remainingWorkdayCnt -= holidayCnt;
  if (remainingWorkdayCnt === 0) return;
  const remainTime = totalRemainTime / remainingWorkdayCnt;
  for (let tr of tbody.children) {
    const scheduleTd = tr.querySelector(
      "td.schedule.specific-timecard_schedule"
    );
    if (isWorkday(trimmedString(scheduleTd?.textContent))) {
      const workTimeTd = tr.querySelector("td.all_work_time");
      if (trimmedString(workTimeTd?.textContent) !== "") continue;

      if (!workTimeTd?.firstElementChild) continue;
      workTimeTd.firstElementChild.textContent = remainTime.toFixed(2);
      workTimeTd.firstElementChild.className = classes.red;
    }
  }

  totalRemainTime -= holidayCnt * baseWorkTime;
  if (totalRemainTime <= 0) return;
  const totalRemainSpan = document.createElement("span");
  totalRemainSpan.textContent = `（残り: ${totalRemainTime.toFixed(2)}）`;
  totalRemainSpan.className = classes.red;
  allWorkTimeTd.append(totalRemainSpan);
};

const trimmedString = (s: string | null | undefined): string => {
  if (!s) return "";
  return s.replace(/(\r\n|\n|\r)/gm, "");
};

const isWorkday = (scheduleName: string): boolean => {
  return scheduleName.indexOf("Flex") !== -1;
};

const isHoliday = (scheduleName: string): boolean => {
  return !isWorkday(scheduleName) && trimmedString(scheduleName) !== "--";
};

Main();
