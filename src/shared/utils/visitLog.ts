import { VISIT_LOG_KEY } from "@core/constants/keys";

const MAX_LOGS = 20;

interface PageVisit {
  path: string;
  visitedAt: number;
}

class VisitLogService {
  log(visit: Omit<PageVisit, "visitedAt">) {
    const existing = localStorage.getItem(VISIT_LOG_KEY);

    if (existing && existing !== "undefined") {
      const existingData = JSON.parse(existing) as PageVisit[];
      const filtered = existingData.filter(v => v.path !== visit.path);
      const next = [...filtered, visit].slice(0, MAX_LOGS);

      localStorage.setItem(VISIT_LOG_KEY, JSON.stringify(next));
    } else {
      localStorage.setItem(VISIT_LOG_KEY, JSON.stringify([visit]));
    }
  }

  getAll(): PageVisit[] {
    const existing = localStorage.getItem(VISIT_LOG_KEY);
    if (existing) {
      return JSON.parse(existing) as PageVisit[];
    }
    return [];
  }

  clear() {
    localStorage.removeItem(VISIT_LOG_KEY);
  }
}

export const visitLogService = new VisitLogService();
