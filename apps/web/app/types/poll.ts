export interface Poll {
  id: string;
  name: string;
  code: string;
  status: "active" | "upcoming" | "past";
  responses: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}
