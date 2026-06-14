export type ClassSession = {
  id: number;
  title: string;
  day_of_week: string;
  start_time: string;
  capacity: number;
  trainer_id: number;
  trainer_name: string;
  specialty: string;
};

export type UserTraining = {
  id: number;
  date: string;
  class_session_id: number;
  title: string;
  day_of_week: string;
  start_time: string;
  capacity: number;
  trainer_name: string;
  specialty: string;
};
